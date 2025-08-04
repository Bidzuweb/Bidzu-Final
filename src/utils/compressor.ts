import Compressor from 'compressorjs'

export const compressFile = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 1000,
      quality: 0.7,
      success: (result) => {
        resolve(result as File)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export const compressFileForAI = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 500,
      quality: 0.6,
      success: (result) => {
        resolve(result as File)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}
