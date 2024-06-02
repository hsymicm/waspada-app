import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native"
import {
  ShareIcon,
  BookmarkIcon,
  MapPinIcon as Pin,
  ChevronUpIcon as UpVoteIcon,
  ChevronDownIcon as DownVoteIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"
import { LinearGradient } from "expo-linear-gradient"
import StyledIconButton from "./StyledIconButton"
import { memo } from "react"
import { formatRatingCounter } from "../libs/utils"
import { router } from "expo-router"

interface CardProps {
  id: string
  location: string
  date: string
  description: string
  rating: number
  url: string
  reportedAlot: boolean
}

function Card({
  id,
  location,
  date,
  description,
  rating,
  url,
  reportedAlot,
}: CardProps) {
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
          {reportedAlot && (
            <View style={styles.reportIndicator}>
              <Text style={styles.reportIndicatorText}>Banyak Laporan</Text>
            </View>
          )}
        </LinearGradient>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0, 0.8)"]}
          style={styles.infoContainer}
        >
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          <View style={styles.footerContainer}>
            <View style={styles.actionContainer}>
              <TouchableWithoutFeedback
                onPress={() => console.log("Share Pressed")}
              >
                <View style={{ padding: 8 }}>
                  <ShareIcon size={16} color={Colors.white} />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => console.log("Bookmark Pressed")}
              >
                <View style={{ padding: 8 }}>
                  <BookmarkIcon size={16} color={Colors.white} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.ratingContainer}>
              <StyledIconButton
                style={{ padding: 3 }}
                variant="secondary"
                width={24}
              >
                <UpVoteIcon size={16} color={Colors.primaryDark} />
              </StyledIconButton>
              <Text>{formatRatingCounter(rating)}</Text>
              <StyledIconButton
                style={{ padding: 3 }}
                variant="secondary"
                width={24}
              >
                <DownVoteIcon size={16} color={Colors.primaryDark} />
              </StyledIconButton>
            </View>
          </View>
        </LinearGradient>
        <Image source={{ uri: url }} style={styles.image} />
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
    // flex: 1,
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
    resizeMode: "cover",
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: -1,
    borderRadius: 16,
  },
})

export default Card
