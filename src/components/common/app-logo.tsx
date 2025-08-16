import Link from 'next/link'
import Image from 'next/image'
import logo from '../../../public/assets/logo.png'
import { memo } from 'react'

export const AppLogo = memo(() => {
  return (
    <Link className="logo" href="/">
      <div className="text-center gap-3">
        <Image width={290} height={90} src={logo} alt="logo-img" />
        <div className="logo-title">
          <h1 className="m-0 text-black fw-bold fs-6">Bid & Win Together</h1>
        </div>
      </div>
    </Link>
  )
})

AppLogo.displayName = 'AppLogo'