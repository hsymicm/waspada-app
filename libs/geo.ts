interface locationType {
  longitude: number
  latitude: number
}

export const revGeocode = async ({latitude, longitude}: locationType) => {
  const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${process.env.HERE_API_KEY}&at=${latitude},${longitude}&types=street&lang=id`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error?.message || "Error, something happened")
  }
}

export const geocode = async ({ location }) => {
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURI(location)}&apiKey=${process.env.HERE_API_KEY}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error?.message || "Error, something happened")
  }
}
