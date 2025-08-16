// HEIC to JPEG converter for frontend preview
// This converts HEIC files to JPEG format so they can be previewed in the browser

export const convertHeicToJpeg = async (file: File): Promise<File> => {
  // Check if the file is a HEIC file
  if (!isHeicFile(file)) {
    return file; // Return original file if not HEIC
  }

  try {
    // Validate that the file is a valid File object
    if (!(file instanceof File) || !file.size || file.size === 0) {
      console.warn('Invalid file object for HEIC conversion:', file);
      return file;
    }

    // Use heic2any library for conversion
    const heic2any = await import('heic2any');

    // Convert HEIC to JPEG - File extends Blob, so this should work
    const jpegBlob = await heic2any.default({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    });

    // Validate the conversion result
    if (!jpegBlob || !(jpegBlob instanceof Blob)) {
      console.warn('HEIC conversion returned invalid result:', jpegBlob);
      return file;
    }

    // Create a new File object with JPEG data
    const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
      type: 'image/jpeg',
      lastModified: file.lastModified
    });

    return jpegFile;
  } catch (error) {
    console.warn('HEIC conversion failed, returning original file:', error);
    return file; // Return original file if conversion fails
  }
};

export const isHeicFile = (file: File): boolean => {
  try {
    if (!file || !file.name) {
      return false;
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      fileName.endsWith('.heics') ||
      fileName.endsWith('.heifs') ||
      fileType === 'image/heic' ||
      fileType === 'image/heif' ||
      fileType === 'image/heic-sequence' ||
      fileType === 'image/heif-sequence';
  } catch (error) {
    console.warn('Error checking if file is HEIC:', error);
    return false;
  }
};

export const createPreviewUrl = async (file: File): Promise<string> => {
  try {
    if (!file || !(file instanceof File)) {
      console.warn('Invalid file object for preview creation:', file);
      return createPlaceholderUrl();
    }

    if (isHeicFile(file)) {
      try {
        const jpegFile = await convertHeicToJpeg(file);
        return URL.createObjectURL(jpegFile);
      } catch (error) {
        console.warn('HEIC preview creation failed:', error);
        // Fallback: create a placeholder or error image
        return createPlaceholderUrl();
      }
    }

    // For non-HEIC files, use the standard method
    return URL.createObjectURL(file);
  } catch (error) {
    console.warn('Preview creation failed:', error);
    return createPlaceholderUrl();
  }
};

export const createPlaceholderUrl = (): string => {
  try {
    // Create a simple placeholder image for failed HEIC conversions
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('HEIC File', 100, 100);
      ctx.fillText('Preview Unavailable', 100, 120);
    }

    return canvas.toDataURL();
  } catch (error) {
    console.warn('Placeholder creation failed:', error);
    // Return a simple data URL as fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpbGUgRXJyb3I8L3RleHQ+PC9zdmc+';
  }
};
