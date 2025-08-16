/**
 * Utility functions for video handling
 */

/**
 * Generates a thumbnail from a video file by seeking to a specific time
 * @param videoElement - The video element to generate thumbnail from
 * @param timeInSeconds - Time in seconds to seek to (default: 0.1)
 * @returns Promise that resolves when thumbnail is ready
 */
export const generateVideoThumbnail = (
  videoElement: HTMLVideoElement,
  timeInSeconds: number = 0.1
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Set the video time to get a specific frame
      videoElement.currentTime = timeInSeconds

      // Listen for the seeked event to know when thumbnail is ready
      const onSeeked = () => {
        videoElement.removeEventListener('seeked', onSeeked)
        resolve()
      }

      // Listen for error events
      const onError = (error: Event) => {
        videoElement.removeEventListener('error', onError)
        reject(error)
      }

      videoElement.addEventListener('seeked', onSeeked)
      videoElement.addEventListener('error', onError)

      // Fallback: if seeked doesn't fire within 2 seconds, resolve anyway
      setTimeout(() => {
        videoElement.removeEventListener('seeked', onSeeked)
        videoElement.removeEventListener('error', onError)
        resolve()
      }, 2000)

    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Checks if a file is a video based on MIME type
 * @param file - File to check
 * @returns boolean indicating if file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/')
}

/**
 * Checks if a URL points to a video file based on extension
 * @param url - URL to check
 * @returns boolean indicating if URL points to a video
 */
export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [
    'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp', 'ogv',
    'ts', 'mts', 'm2ts', 'vob', 'asf', 'rm', 'rmvb', 'divx', 'xvid',
    'h264', 'h265', 'hevc', 'vp8', 'vp9', 'av1', 'theora', 'mpeg',
    'mpeg2', 'mpeg4', 'quicktime', 'realmedia', 'windowsmedia'
  ]

  const extension = url.split('.').pop()?.toLowerCase()
  return extension ? videoExtensions.includes(extension) : false
}

/**
 * Gets the best time to seek to for thumbnail generation
 * @param duration - Video duration in seconds
 * @returns Time in seconds to seek to
 */
export const getThumbnailTime = (duration: number): number => {
  // If duration is available, use 10% of the video or 0.5 seconds, whichever is smaller
  if (duration && duration > 0) {
    return Math.min(duration * 0.1, 0.5)
  }
  // Default to 0.1 seconds for unknown duration
  return 0.1
}
