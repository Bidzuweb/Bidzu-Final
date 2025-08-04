'use server'

import { ACCOUNT_SESSION_COOKIE_NAME, SESSION_COOKIE_NAME } from '@/constants'
import { Account } from '@/core/domain/account'
import { cookies } from 'next/headers'

export async function createSession(uid: string) {
  const loadedCookies = await cookies()
  loadedCookies.set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    path: '/',
  })
}

export async function createAccountSession(accountData: Partial<Account>) {
  const loadedCookies = await cookies()
  loadedCookies.set(ACCOUNT_SESSION_COOKIE_NAME, JSON.stringify(accountData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
  })
}

export async function removeSession() {
  const loadedCookies = await cookies()
  loadedCookies.delete(SESSION_COOKIE_NAME)
}

export async function removeAccountSession() {
  const loadedCookies = await cookies()
  loadedCookies.delete(ACCOUNT_SESSION_COOKIE_NAME)
}
