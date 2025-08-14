import useGlobalContext from '@/hooks/use-context'
import { useTranslation } from '@/app/i18n/client'
import { Icon } from '@/components/common/icon'
import { LocationsSearchInput } from './search-input'
import { GooglePlaceDetails, GooglePlacesPrediction } from '@/core/domain/location'
import { useEffect, useRef, useState } from 'react'
import { FormErrorMessage } from '../form-error-message'
import { LocationsController } from '@/core/controllers/locations'
import { AppStore } from '@/core/store'

interface AuctionFormLocationSectionProps {
  initialLocation: GooglePlaceDetails | null
  inputRef: React.RefObject<HTMLDivElement>
  formIsValid: boolean
  formSubmitTries: number
  useLocationDetection?: boolean
  setLocation: (location: GooglePlaceDetails | null) => void
}

export const AuctionFormLocationSection = (props: AuctionFormLocationSectionProps) => {
  const { inputRef, formIsValid, formSubmitTries, useLocationDetection = true, setLocation } = props
  const globalContext = useGlobalContext()
  const currentLanguage = globalContext.currentLanguage
  const { t } = useTranslation(currentLanguage)

  const [selectedLocation, setSelectedLocation] = useState<GooglePlaceDetails | null>(
    props.initialLocation
  )
  const [deviceLocationLoading, setDeviceLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const initializedRef = useRef(false)
  useEffect(() => {
    if (!props.initialLocation) {
      return
    }

    setSelectedLocation(props.initialLocation)
  }, [props.initialLocation])

  useEffect(() => {
    if (initializedRef.current) {
      return
    }

    getInitialLocation()
    initializedRef.current = true
  })

  const getInitialLocation = async () => {
    if (AppStore.accountData?.locationLatLng) {
      const { lat, lng } = AppStore.accountData?.locationLatLng ?? {}
      const location = await LocationsController.getPlaceDetailsFromLatLng(
        lat, lng
      )

      setSelectedLocation(location)
      setLocation(location)
      return
    }
    getDeviceLocation()
  }

  const getDeviceLocation = async () => {
    if (deviceLocationLoading || !useLocationDetection) {
      return
    }

    setDeviceLocationLoading(true)
    setLocationError(null) // Clear any previous errors

    try {
      const location = await LocationsController.getLocationFromCurrentDevice()
      if (location) {
        setSelectedLocation(location)
        setLocation(location)
        setLocationError(null)
      } else {
        // Location failed but didn't throw an error - show user-friendly message
        console.info('Device location not available - user can manually select location')
        setLocationError('Could not detect your location automatically. Please select a location manually.')
      }
    } catch (error) {
      console.error(`Failed to get device location: ${error}`)
      setLocationError('Failed to get your location. Please select a location manually.')
    } finally {
      setDeviceLocationLoading(false)
    }
  }

  const handleLocationPick = async (location: GooglePlacesPrediction | null) => {
    if (!location) {
      setSelectedLocation(null)
      setLocation(null)
      setLocationError(null) // Clear error when location is cleared
      return
    }

    const locationDetails = await LocationsController.getGooglePlaceDetails(location.reference)
    setSelectedLocation(locationDetails)
    setLocation(locationDetails)
    setLocationError(null) // Clear error when location is selected
  }

  return (
    <div className="mt-40">
      <div className="d-flex flex-row justify-content-between align-items-center mb-10">
        <label className="mb-0 create-auction-label">{t('location.location')}</label>
      </div>

      <div ref={inputRef}>
        <LocationsSearchInput
          selectedLocation={selectedLocation}
          searchInProgress={deviceLocationLoading}
          onLocationPicked={handleLocationPick}
        />
      </div>

      {locationError && (
        <div className="mt-10">
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(13, 202, 240, 0.3)',
              backgroundColor: 'rgba(13, 202, 240, 0.1)',
              color: '#055160',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            role="alert"
          >
            <div className="d-flex align-items-center">
              <Icon type="generic/info" size={16} />
              <span className="ms-2">{locationError}</span>
            </div>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                backgroundColor: deviceLocationLoading ? '#e9ecef' : 'transparent',
                border: '1px solid #0d6efd',
                color: deviceLocationLoading ? '#6c757d' : '#0d6efd',
                cursor: deviceLocationLoading ? 'not-allowed' : 'pointer',
                marginLeft: '12px',
                opacity: deviceLocationLoading ? 0.6 : 1
              }}
              onClick={getDeviceLocation}
              disabled={deviceLocationLoading}
              onMouseEnter={(e) => {
                if (!deviceLocationLoading) {
                  e.currentTarget.style.backgroundColor = '#0d6efd'
                  e.currentTarget.style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                if (!deviceLocationLoading) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#0d6efd'
                }
              }}
            >
              {deviceLocationLoading ? 'Detecting...' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      <div className="pos-rel mt-10">
        {selectedLocation ? (
          <iframe
            title="location"
            className="w-100"
            style={{ borderRadius: 6 }}
            src={`https://www.google.com/maps?q=${selectedLocation?.geometry?.location?.lat},${selectedLocation?.geometry?.location?.lng}&z=15&output=embed`}
          ></iframe>
        ) : (
          <div className="no-location-container">
            <Icon type="generic/map" size={64} />
            <span className="mt-20">{t('info.location_needed')}</span>
          </div>
        )}

        {!formIsValid && !selectedLocation && !!formSubmitTries && (
          <div className="mt-10">
            <FormErrorMessage
              key={formSubmitTries}
              message={t('create_auction.location_required')}
              isError
            />
          </div>
        )}
      </div>
    </div>
  )
}
