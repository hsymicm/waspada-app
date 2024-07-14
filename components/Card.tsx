import { Image as ExpoImage } from "expo-image"
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native"
import {
  ShareIcon,
  BookmarkIcon,
  MapPinIcon as Pin,
  PlayIcon,
} from "react-native-heroicons/solid"
import { BookmarkIcon as BookmarkIconOutline } from "react-native-heroicons/outline"
import { Colors } from "../themes/Colors"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useAuth } from "../contexts/AuthContext"
import { memo, useEffect, useState } from "react"
import {
  handleArchiveReport,
  hasUserArchivedReport,
} from "../models/profileModel"
import VoteCounter from "./VoteCounter"
import { downloadAndShareFile } from "../models/reportModel"
import { formatElapsedTime, formatTimestamp, showToast } from "../libs/utils"

interface CardProps {
  id: string
  location: string
  date: Date
  description: string
  rating: number
  url: string
  thumbnail?: string
  isDateElapsed?: boolean
  isVisible?: boolean
  type: "photo" | "video" | null
}

function Card({
  id,
  location,
  date,
  description,
  rating,
  url,
  type,
  thumbnail,
  isDateElapsed,
}: CardProps) {
  const { currentUser } = useAuth()
  const [hasArchived, setHasArchived] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const checkUserHasArchived = async () => {
      const status = await hasUserArchivedReport(currentUser, id)

      if (status) {
        setHasArchived(true)
      } else {
        setHasArchived(false)
      }
    }

    if (currentUser && id) {
      checkUserHasArchived()
    }
  }, [currentUser, id])

  const handleArchiveSubmit = async () => {
    if (!currentUser) {
      showToast("Tidak bisa arsip, Anda harus masuk terlebih dahulu!")
      return
    }

    setLoading(true)
    try {
      await handleArchiveReport(
        currentUser,
        id,
        hasArchived ? "unarchive" : "archive"
      )
      setHasArchived(!hasArchived)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (url: string, filename: string) => {
    setLoading(true)
    try {
      showToast("Membagikan laporan...")
      await downloadAndShareFile(url, filename)
    } catch (error) {
      showToast("Gagal, membagikan laporan")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => router.navigate(`/(app)/detail/${id}`)}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={["rgba(0,0,0, 0.8)", "transparent"]}
          style={styles.headerContainer}
        >
          <View style={styles.locationContainer}>
            <Pin color={Colors.white} size={18} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.locationText}
            >
              {location}
            </Text>
          </View>
        </LinearGradient>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0, 0.8)"]}
          style={styles.infoContainer}
        >
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {isDateElapsed
                ? formatElapsedTime(date)
                : formatTimestamp(date, { showDay: true })}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          <View style={styles.footerContainer}>
            <View style={styles.actionContainer}>
              <TouchableWithoutFeedback
                onPress={() =>
                  handleShare(url, `${id}.${type === "video" ? "mp4" : "jpg"}`)
                }
                disabled={isLoading}
              >
                <View style={{ padding: 8 }}>
                  <ShareIcon size={16} color={Colors.white} />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={handleArchiveSubmit}
                disabled={isLoading}
              >
                <View style={{ padding: 8 }}>
                  {hasArchived ? (
                    <BookmarkIcon size={18} color={Colors.white} />
                  ) : (
                    <BookmarkIconOutline size={18} color={Colors.white} />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
            <VoteCounter
              card
              reportId={id}
              userId={currentUser?.uid}
              rating={rating}
            />
          </View>
        </LinearGradient>
        {type !== "photo" && type && (
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              zIndex: 2,
            }}
          >
            <View
              style={{
                padding: 24,
                borderRadius: 99,
                backgroundColor: "#00000064",
              }}
            >
              <PlayIcon size={32} color={Colors.white} />
            </View>
          </View>
        )}
        <ExpoImage
          source={type === "photo" || !type ? url : thumbnail}
          contentFit="cover"
          style={styles.image}
          transition={500}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  reportIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  reportIndicatorText: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.white,
  },
  locationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 6,
    paddingVertical: 4,
  },
  locationText: {
    flex: 1,
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.white,
    width: "100%",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 12,
    justifyContent: "space-between",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: {
    position: "relative",
    display: "flex",
    aspectRatio: 1 / 1,
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#9FA3B8",
    borderRadius: 16,
  },
  infoContainer: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dateContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  dateText: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: Colors.black,
  },
  description: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.white,
    width: "100%",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  rating: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: Colors.black,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: -1,
    borderRadius: 16,
  },
})

export default memo(Card)
