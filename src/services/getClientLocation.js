/**
 * Gets the current geolocation from the browser.
 * @returns {Promise<Coordinates | null>} A promise that resolves with coordinates or null if unavailable/denied.
 */

export function getClientLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.warn('Geolocation error:', error.message)
          resolve(null) // Permission denied or error
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // Accept a cached position up to 5 minute old
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser.')
      resolve(null)
    }
  })
}
