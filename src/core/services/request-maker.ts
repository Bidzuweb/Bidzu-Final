import { createSession, removeSession } from '@/app/actions/auth-actions'
import { AuthController } from '../controllers/auth'

export enum RequestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type PayloadType =
  | string
  | FormData
  | Blob
  | ArrayBufferView
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | null

export interface MakeRequestParams {
  method?: RequestType
  path?: string
  payload?: PayloadType
  contentType?: string
  headers?: Record<string, string>
  try?: number
}

export interface IRequestMaker {
  makeRequest: (params?: MakeRequestParams) => Promise<unknown>
  setAuthToken: (token: string) => void
}

class RequestMaker implements IRequestMaker {
  private authToken = ''

  setAuthToken(token: string) {
    this.authToken = token
  }

  /**
   * Safely parse response body based on content type and content length
   */
  private async parseResponseBody(response: Response, path: string): Promise<unknown> {
    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')
    const hasContent = contentLength && contentLength !== '0'

    // Log response details for debugging
    console.debug(`Response from ${path}:`, {
      status: response.status,
      statusText: response.statusText,
      contentType,
      contentLength,
      hasContent,
      ok: response.ok
    })

    // If no content, return null
    if (!hasContent) {
      console.debug(`Empty response from ${path}`)
      return null
    }

    // If JSON content type, try to parse as JSON
    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonResponse = await response.json()
        console.debug(`Successfully parsed JSON response from ${path}:`, jsonResponse)
        return jsonResponse
      } catch (jsonError) {
        console.warn(`Failed to parse JSON response from ${path}:`, jsonError)
        // If JSON parsing fails but it's a successful response, return null
        if (response.ok) {
          console.debug(`JSON parsing failed but response was successful from ${path}`)
          return null
        }
        // If it's an error response, throw a more descriptive error
        throw new Error(`Invalid JSON response from server (${path})`)
      }
    }

    // For non-JSON responses, return as text
    if (contentType && contentType.includes('text/')) {
      const textResponse = await response.text()
      console.debug(`Text response from ${path}:`, textResponse)
      return textResponse
    }

    // For other content types, return as blob
    const blobResponse = await response.blob()
    console.debug(`Blob response from ${path}:`, blobResponse)
    return blobResponse
  }

  async makeRequest(params: MakeRequestParams = {}): Promise<unknown> {
    const {
      method = RequestType.GET,
      path: path = '',
      payload,
      headers: requestHeaders = {},
      contentType = 'application/json',
    } = params
    try {
      const headers: HeadersInit = {}

      if (Object.keys(requestHeaders).length) {
        Object.keys(requestHeaders).forEach((key) => {
          headers[key] = requestHeaders[key]
        })
      }

      if (this.authToken) {
        headers['Authorization'] = `${this.authToken}`
      }

      if (contentType !== 'multipart/form-data') {
        headers['Content-Type'] = contentType
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
        headers,
        method,
        body: payload,
      })

      const responseBody = await this.parseResponseBody(response, path)

      if (response.status >= 400 && response.status < 600) {
        let errorMessage: string

        if (responseBody && typeof responseBody === 'object' && 'error' in responseBody) {
          errorMessage = (responseBody as { error: string }).error
        } else if (responseBody && typeof responseBody === 'string') {
          errorMessage = responseBody
        } else {
          errorMessage = `Request failed with status ${response.status}`
        }

        throw new Error(errorMessage)
      }

      return responseBody
    } catch (err) {
      const error = err as Error
      if (error.message.includes('Token expired')) {
        await this.refreshAccessToken()

        if (params.try && params.try > 5) {
          await AuthController.logout()
          window.location.href = '/'
        }

        return this.makeRequest({ ...params, try: (params.try || 0) + 1 })
      }

      throw error
    }
  }

  private async refreshAccessToken() {
    try {
      const authUser = await AuthController.getAuthUserAsync()
      if (!authUser) {
        throw new Error('No auth user')
      }

      const newAccessToken = await authUser.getIdToken()
      if (!newAccessToken) {
        throw new Error('No auth token')
      }

      this.authToken = newAccessToken

      try {
        await removeSession()
        await createSession(newAccessToken)
      } catch (err) {
        console.error('Error creating session', err)
      }
    } catch (error) {
      console.error('Error refreshing access token', error)
      this.authToken = ''
      AuthController.logout()
    }
  }
}

const requestMaker = new RequestMaker()
export { requestMaker as RequestMaker }
