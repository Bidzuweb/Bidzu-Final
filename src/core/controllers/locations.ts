import { GooglePlaceDetails } from '../domain/location'
import { LocationsRepository } from '../repositories/locations'

class LocationsController {
  searchGooglePlaces(query: string) {
    return LocationsRepository.searchGooglePlaces(query)
  }

  getGooglePlaceDetails(referenceId: string) {
    return LocationsRepository.getGooglePlaceDetails(referenceId)
  }

  locationIsInRomania(location: GooglePlaceDetails) {
    return location.address_components?.some((addr) => {
      return addr.types.includes('country') && addr.short_name === 'RO'
    })
  }

  getPlaceDetailsFromLatLng(lat: number, lng: number) {
    return LocationsRepository.getPlaceDetailsFromLatLng(lat, lng)
  }

  getLocationFromCurrentDevice = (): Promise<GooglePlaceDetails | null> => {
    const options = {
      enableHighAccuracy: false,
      timeout: 10000, // Increased timeout to 10 seconds
      maximumAge: 300000, // Allow cached positions up to 5 minutes old
    }

    return new Promise(async (resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser')
        return resolve(null)
      }

      const handleError = (error: GeolocationPositionError) => {
        let errorMessage = 'Unknown geolocation error'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = `Geolocation error: ${error.message}`
        }

        console.warn(`Geolocation failed: ${errorMessage}`)
        resolve(null) // Resolve with null instead of rejecting
      }

      const handleSuccess = async (position: GeolocationPosition) => {
        try {
          const placeDetails = await LocationsRepository.getPlaceDetailsFromLatLng(
            position.coords.latitude,
            position.coords.longitude
          )

          resolve(placeDetails)
        } catch (error) {
          console.error(`Could not get place details from lat lng: ${error}`)
          resolve(null)
        }
      }

      try {
        // Check if we're in a secure context (HTTPS or localhost)
        if (!window.isSecureContext) {
          console.warn('Geolocation requires a secure context (HTTPS or localhost)')
          return resolve(null)
        }

        // Check permissions
        const permissionStatus = await navigator.permissions.query({
          name: 'geolocation' as PermissionName,
        })

        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options)
        } else if (permissionStatus.state === 'denied') {
          console.warn('Location permission denied by user')
          resolve(null)
        }
      } catch (error) {
        console.error('Error checking geolocation permissions:', error)
        // Fallback: try to get location anyway
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options)
      }
    })
  }
}

const locationsController = new LocationsController()
export { locationsController as LocationsController }
