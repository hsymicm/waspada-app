import { ImageBackground, View, Text, StyleSheet } from "react-native"
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

function Card({ location, date, description, rating, url, reportedAlot }) {  
  return (
    <ImageBackground
      src={url}
      style={styles.container}
      imageStyle={{
        borderRadius: 16,
      }}
    >
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
            <ShareIcon size={16} color={Colors.white} />
            <BookmarkIcon size={16} color={Colors.white} />
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
    </ImageBackground>
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
    resizeMode: "cover",
    backgroundColor: Colors.black,
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
    gap: 24,
    padding: 4,
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
})

export default memo(Card)
