import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  limit,
  orderBy,
  query,
  startAfter,
  serverTimestamp,
  Timestamp,
  addDoc,
  runTransaction,
  startAt,
  endAt,
  writeBatch,
  arrayUnion,
} from "firebase/firestore"
import {
  FIREBASE_DB as db,
  FIREBASE_STORAGE as storage,
} from "../firebase.config"
import { formatElapsedTime, formatTimestamp } from "../libs/utils"
import {
  distanceBetween,
  geohashForLocation,
  geohashQueryBounds,
} from "geofire-common"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export const getReports = {
  firstBatch: async function () {
    try {
      const reportRef = collection(db, "reports")
      const dataQuery = query(reportRef, orderBy("date", "desc"), limit(10))

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
      throw new Error(error.message || "An error has occured")
    }
  },

  nextBatch: async function (key: string) {
    if (!key) {
      throw new Error("Error, key is missing or invalid")
    }

    try {
      const reportRef = collection(db, "reports")
      const dataQuery = query(
        reportRef,
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
      throw new Error(error.message || "An error has occured")
    }
  },
}

export const getPopularReports = {
  firstBatch: async function () {
    try {
      const reportRef = collection(db, "reports")
      const dataQuery = query(reportRef, orderBy("voteCounter", "desc"), limit(10))

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
      throw new Error(error.message || "An error has occured")
    }
  },

  nextBatch: async function (key: string) {
    if (!key) {
      throw new Error("Error, key is missing or invalid")
    }

    try {
      const reportRef = collection(db, "reports")
      const dataQuery = query(
        reportRef,
        orderBy("voteCounter", "desc"),
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
      throw new Error(error.message || "An error has occured")
    }
  },
}

export const getReportsByLocation = async ({
  lat,
  lng,
  radiusInKm,
}: {
  lat: number
  lng: number
  radiusInKm: number
}) => {
  try {
    const center: any = [lat, lng]
    const radius: number = radiusInKm * 1000
    const bounds = geohashQueryBounds(center, radius)

    const promises = []

    for (const b of bounds) {
      const q = query(
        collection(db, "reports"),
        orderBy("hash"),
        startAt(b[0]),
        endAt(b[1])
        // limit(5)
      )
      promises.push(getDocs(q))
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
          const timestamp = reportData.date
          matchingDocs.push({
            ...reportData,
            date: formatElapsedTime(timestamp),
            time: timestamp.toDate(),
            uid: doc.id,
            distance: distanceInM,
          })
        }
      }
    }

    matchingDocs.sort((a, b) => {
      return b.time - a.time
    })

    return matchingDocs
  } catch (error) {
    console.log(error)
  }
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
      const date = formatTimestamp(data.date.toDate())
      return { uid: reportSnapshot.id, ...data, date }
    } else {
      return null
    }
  } catch (error) {
    throw new Error(error.message || "An error has occured")
  }
}

export const setReport = async (
  currentUser: any,
  address: string,
  subdistrict: string,
  district: string,
  city: string,
  county: string,
  longitude: number,
  latitude: number,
  image: any,
  description: string,
  date: any
) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  if (!description) {
    throw new Error("Error, description is missing or invalid")
  }

  if (!date) {
    throw new Error("Error, date is missing or invalid")
  }

  if (!image) {
    throw new Error("Error, image is missing or invalid")
  }

  if (!(longitude && latitude && address)) {
    throw new Error(
      "Error, some or all of the location data is missing or invalid"
    )
  }

  try {
    const hash = geohashForLocation([latitude, longitude])

    const response = await fetch(image)

    if (!response.ok) {
      throw new Error("Failed to get image")
    }

    const blob = await response.blob()

    const filename = image.substring(image.lastIndexOf("/") + 1)
    const storageRef = ref(storage, `reports/images/report-${filename}`)

    const storageSnapshot = await uploadBytes(storageRef, blob)
    const downloadUrl = await getDownloadURL(storageSnapshot.ref)

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
      imageUrl: downloadUrl,
    })

    batch.update(userRef, {
      reportHistory: arrayUnion(reportId)
    })

    await batch.commit();
  } catch (error) {
    throw new Error(error.message || "An error has occured")
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
