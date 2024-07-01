import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  where,
  documentId,
} from "firebase/firestore"
import {
  FIREBASE_DB as db,
  FIREBASE_STORAGE as storage,
} from "../firebase.config"
import { formatTimestamp } from "../libs/utils"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

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
    } else if (action === "unarchive") {
      await updateDoc(reportRef, {
        archivedBy: arrayRemove(userId),
      })

      await updateDoc(userRef, {
        archivedReports: arrayRemove(reportId),
      })
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
    const q = query(reportsRef, where(documentId(), "in", archivedReportsId))
    const querySnapshot = await getDocs(q)

    const archivedReports = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const date = formatTimestamp(data.date.toDate())

      return {
        id: doc.id,
        ...data,
        date,
      }
    })

    return archivedReports
  } catch (error) {
    throw new Error(error.message || "Error, something happened")
  }
}

export const hasUserArchivedReport = async (currentUser, reportId) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  if (!reportId) {
    throw new Error("Error, report id is missing")
  }

  try {
    const userId = currentUser.uid
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("Error, user document does not exist")
    }

    const userData = userDoc.data()
    const archivedReports = userData.archivedReports || []

    return archivedReports.includes(reportId)
  } catch (error) {
    throw new Error(error.message || "Error, something happened")
  }
}

export const getReportsHistory = async (currentUser: any) => {
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
    const reportsHistoryId = userData.reportHistory || []

    if (reportsHistoryId.length === 0) {
      return []
    }

    const reportsRef = collection(db, "reports")
    const q = query(reportsRef, where(documentId(), "in", reportsHistoryId))
    const querySnapshot = await getDocs(q)

    const reportsHistory = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const date = formatTimestamp(data.date.toDate())

      return {
        id: doc.id,
        ...data,
        date,
      }
    })

    return reportsHistory
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

interface ProfileProps {
  profilePicture?: string
  displayName?: string
  description?: string
}

export const updateUserProfile = async (
  currentUser: any,
  { profilePicture, displayName, description }: ProfileProps
) => {
  if (!currentUser) {
    throw new Error("Error, invalid auth")
  }

  try {
    const userId = currentUser.uid
    const userRef = doc(db, "users", userId)

    const updateData: any = {
      updatedAt: serverTimestamp(),
    }

    if (profilePicture !== undefined) {
      const response = await fetch(profilePicture)

      if (!response.ok) {
        throw new Error("Failed to get image")
      }

      const blob = await response.blob()

      const ext = profilePicture.substring(profilePicture.lastIndexOf("/") + 1).split(".")[1]
      const storageRef = ref(storage, `users/${userId}/profile-picture/profile-picture-${userId}.${ext}`)

      const storageSnapshot = await uploadBytes(storageRef, blob)
      const downloadUrl = await getDownloadURL(storageSnapshot.ref)

      updateData.profilePicture = downloadUrl
    }

    if (displayName !== undefined) updateData.displayName = displayName
    if (description !== undefined) updateData.description = description

    await updateDoc(userRef, updateData)
  } catch (error) {
    throw new Error(error.message || "Error, something happened")
  }
}
