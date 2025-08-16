'use client'

import { useTranslation } from '@/app/i18n/client'
import { PriceText } from '@/components/common/price-text'
import { Auction } from '@/core/domain/auction'
// import { Icon } from '@/components/common/icon'
import useGlobalContext from '@/hooks/use-context'
import { observer } from 'mobx-react-lite'
import { AppStore } from '@/core/store'

export const AuctionDetailsReversePrice = observer(
  (props: { auction: Auction }) => {
    const { auction } = props
    const globalContext = useGlobalContext()
    const currentLanguage = globalContext.currentLanguage
    const { t } = useTranslation(currentLanguage)

    // DEBUG: Log the reverse price values to see what we're getting
    console.log('🔍 Reverse Price Debug:', {
      auctionId: auction.id,
      hasReversePrice: auction.hasReversePrice,
      reversePrice: auction.reversePrice,
      auctionData: auction,
      // Check all properties that might contain reverse price data
      allProps: Object.keys(auction),
      // Check if the data might be in a different format
      rawData: JSON.stringify(auction, null, 2)
    })

    // Only show if auction has a reverse price value
    if (!auction.reversePrice) {
      console.log('❌ Reverse price not showing because:', {
        hasReversePrice: auction.hasReversePrice,
        reversePrice: auction.reversePrice,
        typeOfHasReversePrice: typeof auction.hasReversePrice,
        typeOfReversePrice: typeof auction.reversePrice
      })
      return null
    }

    // Check if current user is the auction creator (same logic as Create Bid button)
    const isAuctionOfCurrentAccount = globalContext.cookieAccount?.id === auction.auctioneer?.id ||
      AppStore.accountData?.id === auction.auctioneer?.id

    const handleBuyItNow = () => {
      // TODO: Implement Buy It Now functionality
      console.log('Buy It Now clicked for auction:', auction.id)
    }

    console.log('✅ Reverse price section will render with:', {
      reversePrice: auction.reversePrice,
      hasReversePrice: auction.hasReversePrice,
      isAuctionOfCurrentAccount
    })

    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex flex-column">
          <span className="text-2xl font-bold text-success">
            <PriceText
              price={auction.reversePrice}
              initialCurrencyId={auction.initialCurrencyId}
            />
          </span>
          <span className="secondary-color">{t('auction_details.reverse_price.price')}</span>
        </div>
        {/* Only show Buy It Now button if user is NOT the auction creator */}
        {!isAuctionOfCurrentAccount && (
          <button
            className="fill-btn"
            onClick={handleBuyItNow}
            aria-label={t('auction_details.reverse_price.buy_it_now')}
          >
            {t('auction_details.reverse_price.buy_it_now')}
          </button>
        )}
      </div>
    )
  }
)
