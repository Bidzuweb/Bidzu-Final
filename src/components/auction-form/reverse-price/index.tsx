import { useTranslation } from '@/app/i18n/client'
import { useState } from 'react'
import { FormErrorMessage } from '../form-error-message'

interface AuctionFormReversePriceSectionProps {
  rootRef: React.RefObject<HTMLDivElement>
  selectedReversePrice: number | null
  formIsValid: boolean
  formSubmitTries: number
  setReversePrice: (price: number | null) => void
}

export const AuctionFormReversePriceSection = (props: AuctionFormReversePriceSectionProps) => {
  const {
    formIsValid,
    formSubmitTries,
    rootRef,
    setReversePrice,
  } = props
  const { t } = useTranslation('en')

  const [reversePrice, setReversePriceLocal] = useState<number | null>(props.selectedReversePrice)

  const handleReversePriceChange = (price: number | null) => {
    setReversePriceLocal(price)
    setReversePrice(price)
  }

  return (
    <div className="mt-40" ref={rootRef}>
      <label htmlFor="reversePrice" className="create-auction-label mb-10">
        {t('create_auction.reverse_price')}
      </label>
      <input
        type="number"
        className="create-auction-input create-auction-no-icon-input"
        id="reversePrice"
        placeholder={t('create_auction.enter_reverse_price')}
        value={reversePrice || ''}
        onChange={(e) => handleReversePriceChange(parseFloat(e.target.value) || null)}
        min="0"
        step="0.01"
        required
      />

      {!formIsValid && !reversePrice && !!formSubmitTries && (
        <div className="mt-10">
          <FormErrorMessage
            key={formSubmitTries}
            message={t('create_auction.reverse_price_required')}
            isError
          />
        </div>
      )}
    </div>
  )
}
