'use client'
import { useTranslation } from '@/app/i18n/client'
import useGlobalContext from '@/hooks/use-context'
import Link from 'next/link'

export const AuthButtons = () => {
  const globalContext = useGlobalContext()
  const { currentLanguage } = globalContext
  const { t } = useTranslation(currentLanguage)

  return (
    <div className="d-flex align-items-center gap-3">
      <Link href="/auth/login">
        <button className="btn signin-btn" aria-label={t('auth.sign_in.sign_in')}>
          {t('auth.sign_in.sign_in')}
        </button>
      </Link>
      <Link href="/auth/register">
        <button className="btn register-btn" aria-label={t('auth.sign_up.sign_up')}>
          {t('auth.sign_up.sign_up')}
        </button>
      </Link>
    </div>
  )
} 