import { useTranslation } from '@/app/i18n/client'
import { CustomModal } from '@/components/common/custom-modal'
import { Icon } from '@/components/common/icon'
import { Asset } from '@/core/domain/asset'
import useGlobalContext from '@/hooks/use-context'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { createPreviewUrl } from '@/utils/heic-converter'
import { isVideoUrl } from '@/utils/video-utils'

const AssetsGallery = dynamic(() => import('@/components/common/assets-gallery'), {
  ssr: false,
  loading: () => (
    <div className="loader-wrapper">
      <Icon type="loading" color={'var(--font_1)'} size={40} />
    </div>
  ),
})

export const AssetsGalleryModal = (props: {
  isOpened: boolean
  setOpened: (value: boolean) => void
  assets: string[] | File[] | Asset[] | (File | Asset)[]
  title?: string
}) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const { isOpened, setOpened, assets, title } = props
  const serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL

  const [assetsToDisplay, setAssetsToDisplay] = useState<{ url: string }[]>([])

  // Generate preview URLs for all assets with HEIC conversion
  useEffect(() => {
    const generatePreviewUrls = async () => {
      const processedAssets = await Promise.all(
        assets.map(async (asset) => {
          let url: string
          let type: 'image' | 'video' = 'image'

          if (typeof asset === 'string') {
            url = asset
            // Try to determine type from URL
            if (isVideoUrl(asset)) {
              type = 'video'
            }
          } else if (asset.hasOwnProperty('id')) {
            url = `${serverBaseURL}/assets/${(asset as Asset).path}`
            // Determine type from path extension
            const path = (asset as Asset).path
            if (isVideoUrl(path)) {
              type = 'video'
            }
          } else {
            // Local file - create preview URL (with HEIC conversion if needed)
            url = await createPreviewUrl(asset as File)
            // Determine type from MIME type
            if ((asset as File).type.startsWith('video/')) {
              type = 'video'
            }
          }

          return { url, type }
        })
      )

      setAssetsToDisplay(processedAssets)
    }

    if (assets.length > 0) {
      generatePreviewUrls()
    }

    // Cleanup function to revoke object URLs
    return () => {
      assetsToDisplay.forEach(asset => {
        if (asset.url.startsWith('blob:')) {
          URL.revokeObjectURL(asset.url)
        }
      })
    }
  }, [assets, serverBaseURL])

  return (
    <CustomModal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      open={isOpened}
      onClose={() => {
        setOpened(false)
      }}
      styles={{
        modal: {
          maxWidth: '90%',
          width: '90%',
          backgroundColor: 'var(--background_2)',
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      classNames={
        {
          // modal: 'info-modal'
        }
      }
      closeIcon={<Icon type="generic/close-filled" />}
      center
    >
      <div className="d-flex align-items-center justify-content-between mt-10 mb-20">
        <h4>{title ?? t('assets.selected_images')}</h4>
        <span>
          {assetsToDisplay.length === 1
            ? t('assets.media_singular', { no: assetsToDisplay.length })
            : t('assets.media_plural', { no: assetsToDisplay.length })}
        </span>
      </div>
      <AssetsGallery assets={assetsToDisplay} />
    </CustomModal>
  )
}
