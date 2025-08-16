import { AssetsGlobalUploader } from '@/components/common/assets-global-uploader'
import { AssetsGalleryModal } from './assets-gallery'
import { FilePickerButton } from './file-picker'
import { UploadedAssetsList } from './uploaded-assets'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { useState } from 'react'
import { Asset } from '@/core/domain/asset'

interface CreateAuctionAssetsSectionProps {
  uploadedAssets: (File | Asset)[]
  setUploadedAssets: (files: (Asset | File)[]) => void
}

export const CreateAuctionAssetsSection = (props: CreateAuctionAssetsSectionProps) => {
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [uploadedAssets, setUploadedAssets] = useState<(Asset | File)[]>(props.uploadedAssets)
  const [assetsGalleryOpened, setAssetsGalleryOpened] = useState(false)

  const handleAssetsPick = (files: (Asset | File)[]) => {
    const newAssets = [...uploadedAssets, ...files]
    setUploadedAssets(newAssets)
    props.setUploadedAssets(newAssets)
  }

  const removeUploadedAsset = (index: number) => {
    setUploadedAssets([...uploadedAssets.filter((_, i) => i !== index)])
    props.setUploadedAssets([...uploadedAssets.filter((_, i) => i !== index)])
  }

  return (
    <>
      <FilePickerButton
        multiple
        onFilesPick={handleAssetsPick}
        accept="image/jpeg, image/png, image/webp, image/tiff, image/heic, image/heif, video/mp4, video/avi, video/mov, video/wmv, video/flv, video/webm, video/mkv, video/m4v, video/3gp, video/ogv, video/ts, video/mts, video/m2ts, video/vob, video/asf, video/rm, video/rmvb, video/divx, video/xvid, video/h264, video/h265, video/hevc, video/vp8, video/vp9, video/av1, video/theora, video/mpeg, video/mpeg2, video/mpeg4, video/quicktime, video/realmedia, video/windowsmedia"
      >
        <span>+ {t('assets.add_media')}</span>
      </FilePickerButton>
      <UploadedAssetsList
        assets={uploadedAssets}
        handleRemoveAsset={removeUploadedAsset}
        handleClick={() => {
          setAssetsGalleryOpened(true)
        }}
      />
      <AssetsGlobalUploader
        onUpload={(files) => {
          handleAssetsPick([...uploadedAssets, ...files])
        }}
      />
      <AssetsGalleryModal
        isOpened={assetsGalleryOpened}
        setOpened={setAssetsGalleryOpened}
        assets={uploadedAssets}
      />
    </>
  )
}
