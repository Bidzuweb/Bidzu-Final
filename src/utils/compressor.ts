import Compressor from 'compressorjs'
import { convertHeicToJpeg, isHeicFile } from './heic-converter'

export const compressFile = async (file: File): Promise<File> => {
  try {
    // If it's a video file, return it as-is (no compression needed)
    if (file.type.startsWith('video/')) {
      console.log(`Video file detected (${file.type}), skipping compression`)
      return file
    }

    // If it's a HEIC file, convert it to JPEG first
    let fileToCompress = file
    if (isHeicFile(file)) {
      try {
        fileToCompress = await convertHeicToJpeg(file)
      } catch (error) {
        console.warn('HEIC conversion failed, proceeding with original file:', error)
        // If conversion fails, return the original file
        return file
      }
    }

    // Now compress the file (either original or converted JPEG)
    return new Promise((resolve) => {
      new Compressor(fileToCompress, {
        maxWidth: 1000,
        quality: 0.7,
        success: (result) => {
          resolve(result as File)
        },
        error: (error) => {
          console.warn('Compression failed, returning original file:', error)
          // If compression fails, return the file as-is
          resolve(fileToCompress)
        },
      })
    })
  } catch (error) {
    console.warn('File processing failed, returning original file:', error)
    return file
  }
}

export const compressFileForAI = async (file: File): Promise<File> => {
  try {
    // If it's a video file, return it as-is (no compression needed for AI)
    if (file.type.startsWith('video/')) {
      console.log(`Video file detected (${file.type}), skipping AI compression`)
      return file
    }

    // If it's a HEIC file, convert it to JPEG first
    let fileToCompress = file
    if (isHeicFile(file)) {
      try {
        fileToCompress = await convertHeicToJpeg(file)
      } catch (error) {
        console.warn('HEIC conversion failed, proceeding with original file:', error)
        // If conversion fails, return the file as-is
        return file
      }
    }

    // Now compress the file for AI processing
    return new Promise((resolve) => {
      new Compressor(fileToCompress, {
        maxWidth: 500,
        quality: 0.6,
        success: (result) => {
          resolve(result as File)
        },
        error: (error) => {
          console.warn('AI compression failed, returning original file:', error)
          // If compression fails, return the file as-is
          resolve(fileToCompress)
        },
      })
    })
  } catch (error) {
    console.warn('AI file processing failed, returning original file:', error)
    return file
  }
}
