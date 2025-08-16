# HEIC File Support

This document explains how HEIC file upload and preview support works in the Bidzuu application.

## Overview

HEIC (High Efficiency Image Container) files are now fully supported for:
- Creating auctions
- Updating auctions
- Profile picture uploads
- Chat message attachments
- All other image upload scenarios

## How It Works

### Frontend (Browser)
1. **File Selection**: Users can select HEIC files using the file picker
2. **HEIC Detection**: The system automatically detects HEIC files by extension and MIME type
3. **Preview Conversion**: HEIC files are converted to JPEG format for browser preview
4. **Upload**: Original HEIC files are uploaded to the backend

### Backend (Server)
1. **File Validation**: HEIC files are validated and accepted
2. **Storage**: HEIC files are stored using the configured storage provider
3. **Compression**: HEIC files are converted to JPEG for better compatibility and storage efficiency

## Technical Implementation

### Frontend Components
- `UploadedAssetsList`: Shows previews of uploaded files (including HEIC)
- `AssetsGalleryModal`: Displays images in a gallery view
- `AssetsMessage`: Shows chat message attachments
- `FilePickerButton`: Accepts HEIC files for selection

### Backend Middleware
- `upload.ts`: Validates HEIC files and allows them through
- `utils.ts`: Converts HEIC to JPEG during compression
- `image-extensions.ts`: Includes HEIC extensions
- `mime-types.ts`: Defines HEIC MIME types

### Dependencies
- **Frontend**: `heic2any` package for browser-side HEIC conversion
- **Backend**: `heic-convert` package for server-side HEIC conversion

## Supported HEIC Variants

- `.heic` - Standard HEIC format
- `.heif` - HEIF format
- `.heics` - HEIC sequence format
- `.heifs` - HEIF sequence format

## User Experience

1. **File Selection**: Users see HEIC files in the file picker
2. **Preview**: HEIC files are immediately converted and shown as previews
3. **Upload**: Files are uploaded with progress indication
4. **Storage**: Files are stored and can be viewed later

## Error Handling

- If HEIC conversion fails, users see a placeholder image
- Loading states are shown during conversion
- Error messages are displayed if processing fails
- Fallback to original file if conversion is not possible

## Browser Compatibility

- **Modern Browsers**: Full HEIC support with automatic conversion
- **Older Browsers**: Fallback to placeholder images
- **Mobile**: Native HEIC support on iOS devices

## Performance Considerations

- HEIC conversion happens asynchronously
- Converted JPEGs are cached for the session
- Object URLs are properly cleaned up to prevent memory leaks
- Conversion quality is optimized for preview (80% JPEG quality)

## Troubleshooting

### HEIC Files Not Showing
1. Check if the file has a valid HEIC extension
2. Verify the file is not corrupted
3. Check browser console for conversion errors

### Slow Preview Generation
1. Large HEIC files may take longer to convert
2. Consider compressing HEIC files before upload
3. Check browser performance with multiple HEIC files

### Upload Failures
1. Verify backend HEIC support is enabled
2. Check file size limits
3. Ensure proper MIME type detection

## Future Enhancements

- Batch HEIC conversion for multiple files
- Progressive HEIC loading with thumbnails
- HEIC metadata preservation
- Advanced HEIC editing capabilities
