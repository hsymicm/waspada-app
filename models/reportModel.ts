import {
  collection,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
  query,
  startAfter,
  serverTimestamp,
  Timestamp,
  runTransaction,
  startAt,
  endAt,
  writeBatch,
  arrayUnion,
  where,
} from "firebase/firestore"
import {
  FIREBASE_DB as db,
  FIREBASE_STORAGE as storage,
} from "../firebase.config"
import { formatElapsedTime } from "../libs/utils"
import {
  distanceBetween,
  geohashForLocation,
  geohashQueryBounds,
} from "geofire-common"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"

interface getReportsTypes {
  order: "date" | "voteCounter"
  date?: Date
}

const getStartEndTimestamp = (date: Date) => {
  if (!date) {
    throw new Error("Error, missing or invalid date")
  }

  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const startTimestamp = Timestamp.fromDate(startOfDay)
    const endTimestamp = Timestamp.fromDate(endOfDay)

    return { start: startTimestamp, end: endTimestamp }
  } catch (error) {
    throw new Error(error?.message || "An error has occured")
  }
}

export const getReports = {
  firstBatch: async function ({ order, date }: getReportsTypes) {
    try {
      const reportRef = collection(db, "reports")
      let dataQuery

      if (date) {
        const { start, end } = getStartEndTimestamp(date)
        dataQuery = query(
          reportRef,
          where("date", ">=", start),
          where("date", "<=", end),
          orderBy(order, "desc"),
          limit(10)
        )
      } else {
        dataQuery = query(reportRef, orderBy(order, "desc"), limit(10))
      }

      const dataSnapshot = await getDocs(dataQuery)
      const lastVisible = dataSnapshot.docs[dataSnapshot.docs.length - 1]

      const arr = []

      dataSnapshot.forEach((doc) => {
        const reportId = doc.id
        const data = doc.data()
        const date = data.date.toDate()
        const obj = { uid: reportId, ...data, date }
        arr.push(obj)
      })

      return { data: arr, lastKey: lastVisible }
    } catch (error) {
      throw new Error(error.message || "An error has occured")
    }
  },

  nextBatch: async function (key: string, { order, date }: getReportsTypes) {
    if (!key) {
      throw new Error("Error, key is missing or invalid")
    }

    try {
      const reportRef = collection(db, "reports")
      let dataQuery

      if (date) {
        const { start, end } = getStartEndTimestamp(date)
        dataQuery = query(
          reportRef,
          where("date", ">=", start),
          where("date", "<=", end),
          orderBy(order, "desc"),
          startAfter(key),
          limit(10)
        )
      } else {
        dataQuery = query(
          reportRef,
          orderBy(order, "desc"),
          startAfter(key),
          limit(10)
        )
      }

      const dataSnapshot = await getDocs(dataQuery)
      const lastVisible = dataSnapshot.docs[dataSnapshot.docs.length - 1]

      const arr = []

      dataSnapshot.forEach((doc) => {
        const reportId = doc.id
        const data = doc.data()
        const date = data.date.toDate()
        const obj = { uid: reportId, ...data, date }
        arr.push(obj)
      })

      return { data: arr, lastKey: lastVisible }
    } catch (error) {
      throw new Error(error.message || "An error has occured")
    }
  },
}

export const getReportsByLocation = async ({
  lat,
  lng,
  radiusInKm,
  date,
}: {
  lat: number
  lng: number
  radiusInKm: number
  date?: Date | null
}) => {
  try {
    const center: any = [lat, lng]
    const radius: number = radiusInKm * 1000
    const bounds = geohashQueryBounds(center, radius)

    const promises = []

    for (const b of bounds) {
      if (date) {
        const { start, end } = getStartEndTimestamp(date)
        const q = query(
          collection(db, "reports"),
          where("date", ">=", start),
          where("date", "<=", end),
          orderBy("hash"),
          startAt(b[0]),
          endAt(b[1])
        )
        promises.push(getDocs(q))
      } else {
        const q = query(
          collection(db, "reports"),
          orderBy("hash"),
          startAt(b[0]),
          endAt(b[1])
        )
        promises.push(getDocs(q))
      }
    }

    const snapshots = await Promise.all(promises)
    const matchingDocs = []

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const latitude = doc.get("latitude")
        const longitude = doc.get("longitude")

        const distanceInKm = distanceBetween([latitude, longitude], center)
        const distanceInM = distanceInKm * 1000
        if (distanceInM <= radius) {
          const reportData = doc.data()
          const timestamp = reportData.date.toDate()
          matchingDocs.push({
            ...reportData,
            date: timestamp,
            uid: doc.id,
            distance: distanceInM,
          })
        }
      }
    }

    matchingDocs.sort((a, b) => {
      return b.date - a.date
    })

    return matchingDocs
  } catch (error) {
    console.log(error)
  }
}

export const getReportsByDate = {
  firstBatch: async function (date: string) {
    if (!date) {
      throw new Error("Error, missing or invalid date")
    }

    try {
      const targetDate = new Date(date)

      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)

      const startTimestamp = Timestamp.fromDate(startOfDay)
      const endTimestamp = Timestamp.fromDate(endOfDay)

      const reportRef = collection(db, "reports")
      const dataQuery = query(
        reportRef,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp),
        orderBy("date", "desc"),
        limit(10)
      )

      const dataSnapshot = await getDocs(dataQuery)
      const lastVisible = dataSnapshot.docs[dataSnapshot.docs.length - 1]

      const arr = []

      dataSnapshot.forEach((doc) => {
        const reportId = doc.id
        const data = doc.data()
        const date = formatElapsedTime(data.date)
        const obj = { uid: reportId, ...data, date }
        arr.push(obj)
      })

      return { data: arr, lastKey: lastVisible }
    } catch (error) {
      throw new Error(error?.message || "An error has occured")
    }
  },

  nextBatch: async function (date: string, key: string) {
    if (!key) {
      throw new Error("Error, key is missing or invalid")
    }

    if (!date) {
      throw new Error("Error, missing or invalid date")
    }

    try {
      const targetDate = new Date(date)

      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)

      const startTimestamp = Timestamp.fromDate(startOfDay)
      const endTimestamp = Timestamp.fromDate(endOfDay)

      const reportRef = collection(db, "reports")
      const dataQuery = query(
        reportRef,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp),
        orderBy("date", "desc"),
        startAfter(key),
        limit(10)
      )

      const dataSnapshot = await getDocs(dataQuery)
      const lastVisible = dataSnapshot.docs[dataSnapshot.docs.length - 1]

      const arr = []

      dataSnapshot.forEach((doc) => {
        const reportId = doc.id
        const data = doc.data()
        const date = formatElapsedTime(data.date)
        const obj = { uid: reportId, ...data, date }
        arr.push(obj)
      })

      return { data: arr, lastKey: lastVisible }
    } catch (error) {
      throw new Error(error?.message || "An error has occured")
    }
  },
}

export const getReportDetail = async (id: string) => {
  if (!id) {
    throw new Error("Error, id is undefined or invalid")
  }

  try {
    const reportCollection = collection(db, "reports")
    const reportRef = doc(reportCollection, id)
    const reportSnapshot = await getDoc(reportRef)

    if (reportSnapshot.exists()) {
      const data = reportSnapshot.data()
      const date = data.date.toDate()
      return { uid: reportSnapshot.id, ...data, date }
    } else {
      return null
    }
  } catch (error) {
    throw new Error(error?.message || "An error has occured")
  }
}

export type Report = {
  currentUser: any
  address: string
  subdistrict: string
  district: string
  city: string
  county: string
  longitude: number
  latitude: number
  source: any
  type: "photo" | "video"
  description: string
  date: Date
  thumbnail?: any
}

export const setReport = async ({
  currentUser,
  address,
  subdistrict,
  district,
  city,
  county,
  longitude,
  latitude,
  source,
  type,
  description,
  date,
  thumbnail,
}: Report) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  if (!description) {
    throw new Error("Error, description is missing or invalid")
  }

  if (!date) {
    throw new Error("Error, date is missing or invalid")
  }

  if (!source) {
    throw new Error("Error, source is missing or invalid")
  }

  if (!(longitude && latitude && address)) {
    throw new Error(
      "Error, some or all of the location data is missing or invalid"
    )
  }

  try {
    const hash = geohashForLocation([latitude, longitude])
    let thumbnailDownloadUrl: any

    const response = await fetch(source)

    if (!response.ok) {
      throw new Error("Failed to get source")
    }

    const blob = await response.blob()

    const filename = source.substring(source.lastIndexOf("/") + 1)

    const sourceStorageRef = ref(
      storage,
      `reports/${type === "video" ? "videos" : "images"}/report-${filename}`
    )

    const sourceStorageSnapshot = await uploadBytes(sourceStorageRef, blob)
    const sourceDownloadUrl = await getDownloadURL(sourceStorageSnapshot.ref)

    if (type === "video") {
      const response = await fetch(thumbnail)
      const blob = await response.blob()

      const filename = source
        .substring(source.lastIndexOf("/") + 1)
        .split(".")[0]
      const thumbnailStorageRef = ref(
        storage,
        `reports/thumbnails/report-${filename}.jpg`
      )

      const thumbnailStorageSnapshot = await uploadBytes(
        thumbnailStorageRef,
        blob
      )
      thumbnailDownloadUrl = await getDownloadURL(thumbnailStorageSnapshot.ref)
    }

    const batch = writeBatch(db)

    const userId = currentUser.uid

    const reportCollection = collection(db, "reports")
    const reportRef = doc(reportCollection)
    const reportId = reportRef.id

    const userRef = doc(db, "users", userId)

    batch.set(reportRef, {
      userId,
      description,
      longitude,
      latitude,
      hash,
      address,
      subdistrict,
      district,
      city,
      county,
      date: Timestamp.fromDate(date),
      createdAt: serverTimestamp(),
      votedBy: {},
      voteCounter: 0,
      type,
      [type === "photo" ? "imageUrl" : "videoUrl"]: sourceDownloadUrl,
      thumbnail: thumbnailDownloadUrl || null,
    })

    batch.update(userRef, {
      reportHistory: arrayUnion(reportId),
    })

    await batch.commit()
  } catch (error) {
    throw new Error(error?.message || "An error has occured")
  }
}

export type HandleVoteTypes = {
  reportId: string
  userId: string
  voteValue: 1 | 0 | -1
}

export const handleVote = async ({
  reportId,
  userId,
  voteValue,
}: HandleVoteTypes) => {
  const reportRef = doc(db, "reports", reportId)

  try {
    await runTransaction(db, async (transaction) => {
      const reportDoc = await transaction.get(reportRef)

      if (!reportDoc.exists) {
        throw new Error("Report document does not exist!")
      }

      const reportData = reportDoc.data()
      const votedBy = reportData.votedBy || {}
      const currentVote = votedBy[userId] || 0

      let newVoteCounter = reportData.voteCounter || 0
      newVoteCounter -= currentVote

      if (voteValue !== 0) {
        newVoteCounter += voteValue
        votedBy[userId] = voteValue
      } else {
        delete votedBy[userId]
      }

      transaction.update(reportRef, {
        voteCounter: newVoteCounter,
        votedBy,
      })
    })
  } catch (error) {
    throw new Error(error)
  }
}

export type VoteStatus = "upvoted" | "downvoted" | "none"

export const checkVoteStatus = async (
  reportId: string,
  userId: string
): Promise<VoteStatus> => {
  const reportRef = doc(db, "reports", reportId)

  try {
    const reportDoc = await getDoc(reportRef)
    if (!reportDoc.exists()) {
      throw new Error("Report document does not exist!")
    }

    const reportData = reportDoc.data()
    const votedBy = reportData?.votedBy || {}
    const currentVote = votedBy[userId] || 0

    if (currentVote === 1) {
      return "upvoted"
    } else if (currentVote === -1) {
      return "downvoted"
    } else {
      return "none"
    }
  } catch (error) {
    console.error("Error checking vote status: ", error)
    throw error
  }
}

export const downloadAndShareFile = async (
  fileUrl: string,
  fileName: string
) => {
  try {
    const localUri = `${FileSystem.cacheDirectory}${fileName}`
    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      localUri,
      {}
    )

    const { uri } = await downloadResumable.downloadAsync()

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri)
    } else {
      throw new Error("Sharing is not available on this device")
    }
  } catch (error) {
    throw new Error("Error downloading or sharing file:", error)
  }
}
