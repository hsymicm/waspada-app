import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore"
import { FIREBASE_DB as db } from "../firebase.config"
import { formatElapsedTime } from "../libs/utils"

export const getReports = {
  firstBatch: async function () {
    try {
      const reportRef = collection(db, "reports_temp")
      const dataQuery = query(
        reportRef,
        orderBy("id", "asc"),limit(4)
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
        limit(4)
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
    } catch (error) {}
  },
}
