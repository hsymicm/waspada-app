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
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore"
import {
  FIREBASE_DB as db,
  FIREBASE_STORAGE as storage,
} from "../firebase.config"

export const handleArchiveReport = async (
  currentUser: any,
  reportId: string,
  action: "archive" | "unarchive"
) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  if (!reportId) {
    throw new Error("Error, report id is missing")
  }

  try {
    const userId = currentUser.uid

    const reportRef = doc(db, "reports", reportId)
    const userRef = doc(db, "users", userId)

    if (action === "archive") {
      await updateDoc(reportRef, {
        archivedBy: arrayUnion(userId),
      })

      await updateDoc(userRef, {
        archivedReports: arrayUnion(reportId),
      })

      console.log("Report archived successfully")
    } else if (action === "unarchive") {
      await updateDoc(reportRef, {
        archivedBy: arrayRemove(userId),
      })

      await updateDoc(userRef, {
        archivedReports: arrayRemove(reportId),
      })

      console.log("Report unarchived successfully")
    } else {
      throw new Error("Invalid action. Use 'archive' or 'unarchive'.")
    }
  } catch (error) {
    throw new Error(error || "Error, something happened")
  }
}

export const getArchiveReports = async (currentUser: any) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  try {
    const userId = currentUser.uid

    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("Error, user document does not exist")
    }

    const userData = userDoc.data()
    const archivedReportsId = userData.archivedReports || []

    if (archivedReportsId.length === 0) {
      return []
    }

    const reportsRef = collection(db, "reports")
    const q = query(reportsRef, where("id", "in", archivedReportsId))
    const querySnapshot = await getDocs(q)

    const archivedReports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return archivedReports
  } catch (error) {
    throw new Error(error.message || "Error, something happened")
  }
}

export const getUserProfile = async (currentUser: any) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  try {
    const userId = currentUser.uid

    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("Error, user document does not exist")
    }

    const userData = userDoc.data()
    
    return userData
  } catch (error) {
    throw new Error(error.message || "Error, something happened")
  }
}
