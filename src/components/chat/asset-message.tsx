import { ChatMessage } from "@/core/domain/chat-message";
import React, { useEffect, useState } from "react";
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from "@/app/i18n/client";
import { AssetsGalleryModal } from "../auction-form/assets/assets-gallery";
import { createPreviewUrl } from '@/utils/heic-converter'
import { generateVideoThumbnail, isVideoUrl } from '@/utils/video-utils'

export const AssetsMessage = (params: { message: ChatMessage }) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const [assetsGalleryOpened, setAssetsGalleryOpened] = useState(false);
  const [constructedImagePaths, setConstructedImagePaths] = useState<string[]>([]);

  useEffect(() => {
    const constructImagePaths = async () => {
      const images = params.message.assetPaths;
      const fileListImages = [];
      for (let i = 0; i < (params.message.fileList ? params.message.fileList!.length : 0); i++) {
        fileListImages.push(params.message.fileList![i]);
      }

      let paths: string[] = []

      if (images?.length) {
        paths = images.map((path) => {
          return `${serverUrl}/assets/${path}`
        })
      } else if (fileListImages?.length) {
        // Convert HEIC files to JPEG for preview
        paths = await Promise.all(
          fileListImages.map(async (file) => {
            return await createPreviewUrl(file)
          })
        )
      }

      setConstructedImagePaths(paths)
    }

    constructImagePaths()

    // Cleanup function to revoke object URLs
    return () => {
      constructedImagePaths.forEach(path => {
        if (path.startsWith('blob:')) {
          URL.revokeObjectURL(path)
        }
      })
    }
  }, [params.message.assetPaths, params.message.fileList, serverUrl])

  if (!constructedImagePaths || constructedImagePaths.length === 0) {
    return <div>No media available</div>;
  }

  return (
    <>
      <div
        onClick={() => setAssetsGalleryOpened(true)}
        style={{
          display: "grid",
          gridTemplateColumns: constructedImagePaths.length === 1 ? "1fr" : "repeat(2, 1fr)",
          gridTemplateRows: constructedImagePaths.length > 2 ? "repeat(2, 130px)" : "1fr",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        {constructedImagePaths.slice(0, constructedImagePaths.length > 4 ? 3 : 4).map((imagePath, index) => {
          const isVideo = isVideoUrl(imagePath)

          return isVideo ? (
            <div
              key={index}
              style={{
                width: "100%",
                height: "130px",
                borderRadius: "8px",
                gridColumn:
                  constructedImagePaths.length === 3 && index === 2 ? "1 / -1" : "auto",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <video
                src={imagePath}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                preload="metadata"
                muted
                onLoadedData={(e) => {
                  // Generate thumbnail from video
                  const video = e.target as HTMLVideoElement
                  generateVideoThumbnail(video).catch(console.error)
                }}
              />
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}>
                <div style={{
                  fontSize: "24px",
                  color: "var(--primary)",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                }}>
                  ▶
                </div>
              </div>
            </div>
          ) : (
            <img
              key={index}
              src={imagePath}
              alt={`Media ${index + 1}`}
              style={{
                width: "100%",
                height: "130px",
                objectFit: "cover",
                borderRadius: "8px",
                gridColumn:
                  constructedImagePaths.length === 3 && index === 2 ? "1 / -1" : "auto",
              }}
            />
          )
        })}
        {constructedImagePaths.length > 4 && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "130px",
              gridColumn: "2 / span 1",
              gridRow: "2 / span 1",
            }}
          >
            <img
              src={constructedImagePaths[3]}
              alt="Overlay Image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "8px",
              }}
            >
              +{constructedImagePaths.length - 4}
            </div>
          </div>
        )}
      </div>
      <AssetsGalleryModal
        isOpened={assetsGalleryOpened}
        setOpened={setAssetsGalleryOpened}
        assets={constructedImagePaths ?? []}
        title={t('chat.chat_media')}
      />
    </>
  );
};