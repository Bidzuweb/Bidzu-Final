import { Metadata } from 'next'
import { SEO } from '@/constants'
import { useTranslation } from '../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.terms_title')
  const description = t('pageSEO.terms_description')

  return {
    title,
    openGraph: {
      title,
      description,
      images: [
        {
          url: SEO.IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: SEO.TWITTER_IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  }
}

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  return (
    <>
      <PageWrapper>
        <div className="max-width d-flex flex-column align-items-start w-100 gap-3 mt-30 mt-sm-5 mb-50">
          <h1 className="mt-30">{t('terms_conditions.titles.privacy_policy')}</h1>
          <div>
            <p className="m-0">{t('terms_conditions.privacy_policy.intro')}</p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.privacy_policy.information_collection.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.privacy_policy.information_collection.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.privacy_policy.how_we_use.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.privacy_policy.how_we_use.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.privacy_policy.sharing_disclosure.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.privacy_policy.sharing_disclosure.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.privacy_policy.data_security.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.privacy_policy.data_security.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.privacy_policy.user_rights.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.privacy_policy.user_rights.content')}
            </p>

            <p className="m-0 mt-20">
              {t('terms_conditions.privacy_policy.consent')}
            </p>
          </div>

          <h1 className="mt-30">{t('terms_conditions.titles.terms_of_service')}</h1>
          <div>
            <p className="m-0">{t('terms_conditions.terms_of_service.intro')}</p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.user_eligibility.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.user_eligibility.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.platform_use.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.platform_use.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.seller_fees.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.seller_fees.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.prohibited_listings.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.prohibited_listings.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.disputes.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.disputes.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.account_suspension.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.account_suspension.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.limitation_liability.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.limitation_liability.content')}
            </p>

            <h2 className="terms-h2 mt-20 mb-10">
              {t('terms_conditions.terms_of_service.modifications.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_of_service.modifications.content')}
            </p>

            <p className="m-0 mt-20">
              {t('terms_conditions.terms_of_service.contact')}
            </p>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
