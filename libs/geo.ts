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
    console.error("Error fetching reverse geocode data:", error)
    return null
  }
}
