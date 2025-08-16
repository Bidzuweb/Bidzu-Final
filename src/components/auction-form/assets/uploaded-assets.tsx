import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules'
import { useEffect, useState } from 'react'
import { Asset } from '@/core/domain/asset'
import { Icon } from '@/components/common/icon'
import { createPreviewUrl } from '@/utils/heic-converter'
import { generateVideoThumbnail, isVideoFile as isVideoFileUtil, isVideoUrl } from '@/utils/video-utils'

export const UploadedAssetsList = (props: {
  assets: File[] | Asset[] | (File | Asset)[]
  assetsType?: 'bid' | 'auction'
  handleRemoveAsset?: (index: number) => void
  handleClick: (index: number) => void
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { assets, handleRemoveAsset, handleClick } = props

  const [assetsLen, setAssetsLen] = useState(assets.length)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAssetsLen(props.assets.length)
  }, [props.assets])

  // Generate preview URLs for all assets
  useEffect(() => {
    const generatePreviewUrls = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const urls = await Promise.all(
          assets.map(async (asset) => {
            if (asset.hasOwnProperty('id')) {
              // Server asset - use server URL
              const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL
              return `${serverBaseURL}/assets/${(asset as Asset).path}`
            } else {
              // Local file - create preview URL (with HEIC conversion if needed)
              return await createPreviewUrl(asset as File)
            }
          })
        )
        setPreviewUrls(urls)
      } catch (err) {
        console.error('Error generating preview URLs:', err)
        setError('Failed to generate image previews')
      } finally {
        setIsLoading(false)
      }
    }

    if (assets.length > 0) {
      generatePreviewUrls()
    }

    // Cleanup function to revoke object URLs
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [assets])

  const renderRightArrow = () => {
    return (
      <div className={`right-arrow-root uploaded-assets-next-button`}>
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-right-filled" />
        </div>
        <style jsx>{`
          .right-arrow {
            font-weight: 600;
          }
          .right-arrow-root {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            right: -20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  const renderLeftArrow = () => {
    return (
      <div className={`arrow-root uploaded-assets-prev-button`}>
        <div className=" d-flex align-items-center justify-content-center">
          <Icon type="arrows/arrow-left-filled" />
        </div>
        <style jsx>{`
          .left-arrow {
            font-weight: 600;
          }
          .arrow-root {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            left: -20px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  // Helper function to check if a file is a video
  const isVideoFile = (file: File | Asset): boolean => {
    if (file.hasOwnProperty('id')) {
      // Server asset - check path extension
      const path = (file as Asset).path
      return isVideoUrl(path)
    } else {
      // Local file - check MIME type
      return isVideoFileUtil(file as File)
    }
  }

  const renderAssetItem = (asset: File | Asset, index: number) => {
    const url = previewUrls[index]
    const isVideo = isVideoFile(asset)

    if (isLoading) {
      return (
        <div className="uploaded-image loading">
          <div className="loading-spinner">
            <Icon type="loading" size={24} />
          </div>
          <style jsx>{`
            .uploaded-image.loading {
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--background_2);
            }
            .loading-spinner {
              color: var(--font_2);
            }
          `}</style>
        </div>
      )
    }

    if (error) {
      return (
        <div className="uploaded-image error">
          <div className="error-message">
            <Icon type="generic/error" size={24} />
            <span>{error}</span>
          </div>
          <style jsx>{`
            .uploaded-image.error {
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--background_2);
            }
            .error-message {
              display: flex;
              flex-direction: column;
              align-items: center;
              color: var(--error);
              font-size: 12px;
              text-align: center;
            }
          `}</style>
        </div>
      )
    }

    if (!url) {
      return (
        <div className="uploaded-image placeholder">
          <div className="placeholder-text">Processing...</div>
          <style jsx>{`
            .uploaded-image.placeholder {
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--background_2);
            }
            .placeholder-text {
              color: var(--font_2);
              font-size: 12px;
            }
          `}</style>
        </div>
      )
    }

    if (isVideo) {
      // Render video thumbnail with play button overlay
      return (
        <div
          className="uploaded-video"
          onClick={() => handleClick(index)}
        >
          <video
            src={url}
            className="video-preview"
            preload="metadata"
            muted
            onLoadedData={(e) => {
              // Generate thumbnail from video
              const video = e.target as HTMLVideoElement
              generateVideoThumbnail(video).catch(console.error)
            }}
          />
          <div className="video-overlay">
            <div className="play-button">
              <Icon type="generic/play" size={32} />
            </div>
          </div>

          {!!handleRemoveAsset && (
            <button
              className="fill-btn remove-asset-button"
              onClick={(e) => {
                handleRemoveAsset(index)
                e.stopPropagation()
              }}
            >
              <span> {t('generic.remove')}</span>
            </button>
          )}

          <style jsx>{`
            .uploaded-video {
              height: 150px;
              width: 130px;
              border-radius: 6px;
              border: 1px solid var(--separator);
              transition: all 0.3s ease-in-out;
              box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
              cursor: pointer;
              position: relative;
              overflow: hidden;
            }
            .uploaded-video:hover {
              transform: scale(1.03);
            }
            .video-preview {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 6px;
            }
            .video-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 6px;
            }
            .play-button {
              color: var(--primary);
              background: rgba(255, 255, 255, 0.9);
              border-radius: 50%;
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            .remove-asset-button {
              display: none;
              position: absolute;
              bottom: 8px;
              padding: 4px 8px;
              align-items: center;
              justify-content: center;
              height: 40px;
              font-size: 14px;
              font-weight: 400;
            }
            .uploaded-video:hover .remove-asset-button {
              display: flex;
            }
          `}</style>
        </div>
      )
    }

    // Render image with background
    return (
      <div
        style={{ backgroundImage: `url(${url})` }}
        className="uploaded-image"
        onClick={() => handleClick(index)}
      >
        {!!handleRemoveAsset && (
          <button
            className="fill-btn remove-asset-button"
            onClick={(e) => {
              handleRemoveAsset(index)
              e.stopPropagation()
            }}
          >
            <span> {t('generic.remove')}</span>
          </button>
        )}

        <style jsx>{`
          .uploaded-image {
            height: 150px;
            width: 130px;
            border-radius: 6px;
            border: 1px solid var(--separator);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: end;
            justify-content: center;
          }
          .uploaded-image:hover {
            transform: scale(1.03);
          }
          .remove-asset-button {
            display: none;
            margin-bottom: 8px;
            padding: 4px 8px;
            align-items: center;
            justify-content: center;
            height: 40px;
            font-size: 14px;
            font-weight: 400;
          }
          .uploaded-image:hover .remove-asset-button {
            display: flex;
          }
        `}</style>
      </div>
    )
  }

  if (!assetsLen) {
    return null
  }

  return (
    <div className="d-flex assets-root">
      {assetsLen <= 2 ? (
        <div className="few-assets-list d-flex">
          {assets.map((file, index) => {
            return (
              <div key={index} className="mr-20">
                {renderAssetItem(file, index)}
              </div>
            )
          })}
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Scrollbar]}
          spaceBetween={20}
          slidesPerView={'auto'}
          style={{ padding: '4px 4px' }}
          loop={false}
          navigation={{
            nextEl: '.uploaded-assets-next-button',
            prevEl: '.uploaded-assets-prev-button',
          }}
        >
          {assets.map((file, index) => {
            return (
              <SwiperSlide
                key={index}
                className="uploaded-assets-slide"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                {renderAssetItem(file, index)}
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
      {assetsLen > 2 && (
        <div className="">
          {renderLeftArrow()}
          {renderRightArrow()}
        </div>
      )}
    </div>
  )
}
