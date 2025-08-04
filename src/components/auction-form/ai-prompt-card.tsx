import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import { Icon } from '../common/icon'
import { AppStore } from '@/core/store'
import { useState } from 'react'
import { AuthService } from '@/core/services/auth'
import { EmailVerificationNeeded } from '../modals/email-verification-needed'
import { AiController } from '@/core/controllers/ai'
import { useCurrentCurrency } from '@/hooks/current-currency'
import { toast } from 'react-toastify'
import { AiGeneratedDataResult } from '@/core/repositories/ai'

interface AiPromptCardProps {
  assets: File[]
  onGenerated: (result: AiGeneratedDataResult) => void
}

export const AiPromptCard = (props: AiPromptCardProps) => {
  const globalContext = useGlobalContext()
  const { currentLanguage, appSettings } = globalContext
  const { t } = useTranslation(currentLanguage)

  const { assets } = props

  const [isGenerating, setIsGenerating] = useState(false)
  const [unverifiedUserModalOpened, setUnverifiedUserModalOpened] = useState(false)
  const currentCurrency = useCurrentCurrency()

  const handleGenerate = async () => {
    if (isGenerating) {
      return
    }
    const verificationNeeded = !appSettings.allowAiResponsesOnUnvalidatedEmails
    const emailIsVerified = await AuthService.userHasEmailVerified(appSettings)
    if (verificationNeeded && !emailIsVerified) {
      setUnverifiedUserModalOpened(true)
      return
    }

    setIsGenerating(true)
    try {
      const result = await AiController.generateAuctionDataFromImages({
        appSettings,
        assets,
        currency: currentCurrency?.name['en'] ?? 'USD',
      })

      if (!result) {
        toast.error(t('ai.generate_error'))
        return
      }

      props.onGenerated(result)
    } catch (error) {
      if ((error as Error).message === 'NOT_ENOUGH_COINS') {
        toast.error(t('ai.not_enough_coins'))
        return
      }

      if ((error as Error).message === 'AI_DISABLED') {
        toast.error(t('ai.ai_disabled'))
        return
      }

      if ((error as Error).message === 'MAX_AI_RESPONSES_REACHED') {
        toast.error(t('ai.max_ai_responses_reached'))
        return
      }

      toast.error(t('ai.generate_error'))
    } finally {
      setIsGenerating(false)
    }
  }

  if (assets.length === 0) {
    return null
  }

  const usedAiResponses = AppStore.accountData?.aiResponsesCount ?? 0
  const coinsToSpend =
    usedAiResponses < appSettings.freeAiResponses ? 0 : appSettings.aiResponsesPriceInCoins

  return (
    <div
      style={{
        padding: '1px',
        background: `linear-gradient(90deg, 
      #F45C43,
      #DC4973,
      #AB4F8F,
      #5438DC,
      #357DED,
      #008072
    )`,
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          background: 'var(--background_1)',
          padding: '16px',
          borderRadius: '6px',
        }}
        className="d-flex flex-column gap-3"
      >
        <div className="d-flex gap-3 align-items-start">
          <Icon type="generic/ai" size={24} />
          <span> {t('ai.generate_description')}</span>
        </div>

        <button
          className="btn btn-gradient d-flex align-items-center justify-content-center"
          onClick={handleGenerate}
          style={{ minHeight: 46, border: 'none' }}
        >
          {isGenerating ? (
            <div className="loader-wrapper d-flex justify-content-center">
              <Icon type="loading" color={'white'} size={32} />
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span>{t('ai.generate')}</span>

              {coinsToSpend > 0 && (
                <span className="ml-10 d-flex align-items-center">
                  (<Icon type="generic/coin" />
                  <span className="ml-5">{t('buy_coins.coins_no', { no: coinsToSpend })})</span>
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      <EmailVerificationNeeded
        isOpened={unverifiedUserModalOpened}
        close={() => setUnverifiedUserModalOpened(false)}
        onValidated={handleGenerate}
      />
    </div>
  )
}
