export const scrollTop = (ref: any) => {
  if (ref?.current) {
    ref.current?.scrollTo({
      options: { y: 0 },
    })
  }
}

export const handleAuthErrorMessage = (message?: string) => {
  const defaultMsg = "Error, something wrong happened"

  if (!message) {
    return defaultMsg
  }

  const parts = message.split("/")

  if (parts[0] !== "auth") {
    return defaultMsg
  }

  const str = parts[1].replaceAll("-", " ")
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatRatingCounter = (count: number) => {
  if (count >= 1000000) {
    const millions = Math.floor(count / 1000000)
    const remainder = Math.floor((count % 1000000) / 100000)
    return `${millions}.${remainder}M`
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000)
    const remainder = Math.floor((count % 1000) / 100)
    return `${thousands}.${remainder}K`
  } else {
    return count.toString()
  }
}

export const formatElapsedTime = (timestamp: any) => {
  const current: any = new Date()
  const timestampDate = timestamp.toDate()
  const elapsedTime = current - timestampDate
  const seconds = Math.floor(elapsedTime / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `${days} hari yang lalu`
  } else if (hours >= 1) {
    return `${hours} jam yang lalu`
  } else if (minutes >= 1) {
    return `${minutes} menit yang lalu`
  } else {
    return "Baru saja" 
  }
}

export const parseMetadataTimestamp = (date: string) => {
  const [datePart, timePart] = date.split(" ")
  const [year, month, day] = datePart.split(":").map(Number)
  const [hours, minutes, seconds] = timePart.split(":").map(Number)

  const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds)
  return parsedDate
}

export const formatTimestamp = (date: any) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12

  return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`
}

export const kMToLongitudes = (km: number, atLatitude: number) => {
  return (km * 0.0089831) / Math.cos(atLatitude * (Math.PI / 180))
}
