'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const NoScrollBodyCheck = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (document.body.classList.contains('no-scroll')) {
      document.body.classList.remove('no-scroll')
    }
  }, [pathname])

  return null
}
