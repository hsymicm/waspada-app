interface locationType {
  longitude: number
  latitude: number
}

export const revGeocode = async ({ latitude, longitude }: locationType) => {
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

export const geocode = async ({ location }: { location: string }) => {
  const arr = location.split(":")
  let url: string

  if (arr[0] === "here") {
    url = `https://lookup.search.hereapi.com/v1/lookup?id=${encodeURI(
      location
    )}&apiKey=${process.env.HERE_API_KEY}`
  } else {
    url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURI(
      location
    )}&apiKey=${process.env.HERE_API_KEY}`
  }

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

export const geoAutocomplete = async ({ query, latitude, longitude }) => {
  const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURI(
    query
  )}&at=${latitude},${longitude}&lang=id&apiKey=${process.env.HERE_API_KEY}`

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

export const geoAutosuggest = async ({ query, latitude, longitude }) => {
  const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURI(
    query
  )}&at=${latitude},${longitude}&lang=id&limit=5&apiKey=${process.env.HERE_API_KEY}`

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
