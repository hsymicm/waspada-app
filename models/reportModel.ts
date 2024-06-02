import {
  collection,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore"
import { FIREBASE_DB as db } from "../firebase.config"
import { formatElapsedTime, formatTimestamp } from "../libs/utils"

export const getReports = {
  firstBatch: async function () {
    try {
      const reportRef = collection(db, "reports_temp")
      const dataQuery = query(
        reportRef,
        orderBy("id", "asc"),limit(6)
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
      console.log(error)
    }
  },

  nextBatch: async function (key: string) {
    try {
      const reportRef = collection(db, "reports_temp")
      const dataQuery = query(
        reportRef,
        orderBy("id", "asc"),
        startAfter(key),
        limit(6)
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
      console.log(error)
    }
  },
}

export const getReportDetail = async (id: string) => {
  if (!id) return null

  try {
    const reportCollection = collection(db, "reports_temp")
    const reportRef = doc(reportCollection, id)
    const reportSnapshot = await getDoc(reportRef)

    if (reportSnapshot.exists()) {
      const data = reportSnapshot.data()
      const date = formatTimestamp(data.date)
      return { uid: reportSnapshot.id, ...data, date}
    } else {
      return null
    }

  } catch (error) {
    console.log(error)
  }
}
