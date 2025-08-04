import { GENERAL_ERRORS } from '@/constants/errors'
import { RequestMaker, RequestType } from '../services/request-maker'

export interface AiGeneratedDataResult {
  title: string
  description: string
  category: string
  price: number
}

class AiRepository {
  private basePath = '/ai'

  public async generateDescription(params: {
    files: File[]
    currency: string
  }): Promise<AiGeneratedDataResult | null> {
    try {
      const data = await this.generateFormData(params)
      const response = (await RequestMaker.makeRequest({
        method: RequestType.POST,
        path: `${this.basePath}/generate-from-images`,
        payload: data,
        contentType: 'multipart/form-data',
      })) as Record<string, unknown>
      return {
        title: response.title as string,
        description: response.description as string,
        category: response.category as string,
        price: response.price as number,
      }
    } catch (error) {
      this.handleError(error as Error)
      console.error('Error generating description:', error)
      return null
    }
  }

  private async generateFormData(params: Record<string, unknown>): Promise<FormData> {
    const form = new FormData()
    Object.keys(params).forEach((key) => {
      if (key === 'files') {
        const files = params[key] as File[]
        files.forEach((file) => {
          form.append('files', file)
        })
      } else {
        form.set(
          key,
          typeof params[key] === 'string' ? (params[key] as string) : JSON.stringify(params[key])
        )
      }
    })

    return form
  }

  private handleError(error: Error) {
    const response = JSON.stringify(error)

    if (response.includes('TOO_MANY')) {
      return { error: true, message: GENERAL_ERRORS.TOO_MANY_ASSETS }
    }
    if (response.includes('ASSET_TOO_BIG')) {
      return { error: true, message: GENERAL_ERRORS.ASSET_TOO_BIG }
    }
    if (response.includes('ASSET_NOT_SUPPORTED')) {
      return { error: true, message: GENERAL_ERRORS.ASSET_NOT_SUPPORTED }
    }

    return { error: true, message: 'Could not create or update auction' }
  }
}

const AiRepositoryInstance = new AiRepository()
export { AiRepositoryInstance as AiRepository }
