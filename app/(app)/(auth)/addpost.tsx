import { ScrollView, View, Text, Image, StyleSheet } from "react-native"
import { Colors } from "../../../themes/Colors"
import {
  ExclamationCircleIcon,
  ArrowsPointingOutIcon,
  ShareIcon,
  BookmarkIcon,
  ChevronUpIcon as UpVoteIcon,
  ChevronDownIcon as DownVoteIcon,
} from "react-native-heroicons/solid"
import StyledIconButton from "../../../components/StyledIconButton"
import { useState } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import { formatRatingCounter } from "../../../libs/utils"

export default function AddPost() {
  const [isExpand, setExpand] = useState(false)
  const dummyDesc =
    "Leo vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. In fermentum posuere urna nec tincidunt praesent semper feugiat nibh sed pulvinar proin gravida fermentum leo vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl."

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <ScrollView
        style={{
          position: "relative",
          backgroundColor: Colors.lightGray,
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerNotification}>
            <ExclamationCircleIcon color={Colors.white} />
            <Text style={styles.headerText}>
              Terdapat banyak laporan di area yang sama
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageContent}
              source={{
                uri: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?q=80&w=2070",
              }}
            />
            <StyledIconButton onPress={() => {}} style={styles.imageExpand}>
              <ArrowsPointingOutIcon color={Colors.white} />
            </StyledIconButton>
          </View>
          <View style={styles.detailContainer}>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Deskripsi</Text>
              <View style={{ display: "flex", gap: 4 }}>
                <Text
                  style={styles.detailParagraph}
                  numberOfLines={isExpand ? null : 2}
                >
                  {dummyDesc}
                </Text>
                <TouchableOpacity onPress={() => setExpand(!isExpand)}>
                  <Text style={styles.detailExpand}>
                    {isExpand ? "Lihat lebih sedikit" : "Lihat selengkapnya"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Waktu</Text>
              <Text style={styles.detailParagraph}>Mei 14, 2024 - 1:18 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.footerCapsule}>
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={() => {}}>
              <ShareIcon size={18} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <BookmarkIcon size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.ratingContainer}>
            <StyledIconButton
              onPress={() => {}}
              style={{ padding: 4 }}
              variant="secondary"
              width={24}
            >
              <UpVoteIcon size={18} color={Colors.primaryDark} />
            </StyledIconButton>
            <Text style={styles.counter}>{formatRatingCounter(1283)}</Text>
            <StyledIconButton
              onPress={() => {}}
              style={{ padding: 4 }}
              variant="secondary"
              width={24}
            >
              <DownVoteIcon size={18} color={Colors.primaryDark} />
            </StyledIconButton>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerNotification: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },

  headerText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.white,
  },

  container: {
    padding: 16,
    gap: 16,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1 / 1,
  },

  imageContent: { width: "100%", height: "100%", borderRadius: 16 },

  imageExpand: {
    backgroundColor: "#00000060",
    position: "absolute",
    bottom: 16,
    right: 16,
  },

  detailContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 16,
  },

  detailInfo: {
    display: "flex",
    gap: 8,
  },

  detailLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.black,
  },

  detailParagraph: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
  },

  detailExpand: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.accent,
  },

  actionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    display: "flex",
    flexDirection: "row",
    gap: 24,
  },

  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 8,
  },

  counter: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.white,
  },

  footerContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },

  footerCapsule: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 99,
  },
})
