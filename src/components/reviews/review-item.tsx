'use client'
import { Review } from '@/core/domain/review'
import Link from 'next/link'
import { memo, useState } from 'react'
import Image from 'next/image'
import { generateNameForAccount } from '@/utils'
import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { BaseRating } from './rating'
import ShowMoreText from 'react-show-more-text'
import { FormattedDate } from '../common/formatted-date'
import { ReviewsController } from '@/core/controllers/review'
import { Icon } from '../common/icon'
import { LanguageDetectorService } from '@/core/services/lang-detector'

export const ReviewItem = memo(
  (props: { review: Review; withBorder?: boolean; viewAuction?: boolean }) => {
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)
    const { review, viewAuction = true, withBorder = false } = props

    const [displayTranslatedContent, setDisplayTranslatedContent] = useState(false)
    const [translationInProgress, setTranslationInProgress] = useState(false)
    const [translatedDescription, setTranslatedDescription] = useState('')

    const translateContent = async () => {
      if (displayTranslatedContent) {
        setDisplayTranslatedContent(false)
        return
      }

      if (!displayTranslatedContent && translatedDescription?.length) {
        setDisplayTranslatedContent(true)
        return
      }

      if (translationInProgress) {
        return
      }

      setTranslationInProgress(true)
      try {
        const translationResult = await ReviewsController.translate(review.id, currentLanguage)
        setTranslatedDescription(translationResult?.description || '')
        setDisplayTranslatedContent(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
      } finally {
        setTranslationInProgress(false)
      }
    }

    const checkIfTranslationShouldBeEnabled = () => {
      if (!review.description?.length) {
        return false
      }

      const descriptionLang = LanguageDetectorService.detectLanguage(review.description)
      return !!(
        (descriptionLang && descriptionLang !== currentLanguage)
      )
    }

    if (!review.reviewer) {
      return null
    }

    return (
      <div
        className="app-section"
        style={{
          ...(withBorder ? { border: '1px solid var(--separator)', boxShadow: 'none' } : {}),
        }}
      >
        <div className="justify-content-between review-item">
          <div className="d-flex align-items-center gap-2">
            <Link href={`/account/${review.reviewer.id}`}>
              <Image
                height={40}
                width={40}
                src={review.reviewer.picture}
                alt="User picture"
                style={{ borderRadius: '50%' }}
              />
            </Link>

            <div>
              <div style={{ height: 22 }}>
                <Link href={`/account/${review.reviewer.id}`}>
                  <strong>{generateNameForAccount(review.reviewer)} </strong>
                </Link>
                <span>{t('auction_details.reviews.added_a_review')}</span>
              </div>
              <span className='secondary-color fw-light'> <FormattedDate date={review.createdAt} format='D MMM, H:mm' /> </span>

            </div>
          </div>

          <div className="mt-10 text-center" style={{ width: 200 }}>
            <BaseRating initialValue={review.stars} inactiveColor="var(--font_3)" readonly />
          </div>
        </div>

        <div className="mt-10 w-100">
          {!!review.description ? (
            <ShowMoreText
              lines={2}
              more={t('generic.see_more')}
              less={t('generic.see_less')}
              anchorClass="blue-text"
              expanded={false}
            >
              {displayTranslatedContent ? translatedDescription : review.description}
            </ShowMoreText>
          ) : (
            t('auction_details.no_description_provided')
          )}

          {checkIfTranslationShouldBeEnabled() && (
            <div className="d-flex justify-content-start mt-10">
              {translationInProgress ? (
                <div className="loader-wrapper">
                  <Icon type="loading" size={28} />
                </div>
              ) : (
                <span className="translation-text" onClick={translateContent}>
                  {displayTranslatedContent ? t('generic.see_original') : t('generic.translate')}
                </span>
              )}
            </div>
          )}
        </div>
        {viewAuction && (
          <div className="d-flex align-items-center justify-content-center mt-10">
            <Link href={`/auction/${review.auctionId}`}>
              <span className="blue-text">{t('profile.see_review_auction')}</span>
            </Link>
          </div>
        )}
      </div>
    )
  }
)

ReviewItem.displayName = 'ReviewItem'
