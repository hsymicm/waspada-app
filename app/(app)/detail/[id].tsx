import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native"
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
import { useEffect, useState } from "react"
import { formatRatingCounter } from "../../../libs/utils"
import { useLocalSearchParams } from "expo-router"
import { getReportDetail } from "../../../models/reportModel"
import LoadingSkeleton from "../../../components/Skeleton/CardSkeleton"
import TextSkeleton from "../../../components/Skeleton/TextSkeleton"
import ImageModal from "../../../components/Modal/ImageModal"

function DetailPost() {
  const { id } = useLocalSearchParams()
  const [isExpand, setExpand] = useState(false)
  const [reportDetail, setReportDetail] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)

  const fetchReportDetail = async (id: any) => {
    setLoading(true)
    const data = await getReportDetail(id)
    setLoading(false)
    setReportDetail(data)
  }

  useEffect(() => {
    fetchReportDetail(id)
  }, [id])

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          position: "relative",
          backgroundColor: Colors.lightGray,
        }}
      >
        <View style={styles.container}>
          <ImageModal
            imageModalVisible={imageModalVisible}
            setImageModalVisible={setImageModalVisible}
            url={reportDetail?.url}
          />
          {!isLoading && reportDetail?.many && (
            <View style={styles.headerNotification}>
              <ExclamationCircleIcon color={Colors.white} />
              <Text style={styles.headerText}>
                Terdapat banyak laporan di area yang sama
              </Text>
            </View>
          )}
          {!isLoading && reportDetail?.url ? (
            <View style={styles.imageContainer}>
              <Image
                style={styles.imageContent}
                source={{
                  uri: reportDetail.url,
                }}
              />
              <StyledIconButton
                onPress={() => setImageModalVisible(true)}
                style={[styles.imageExpand, { bottom: 16, right: 16 }]}
              >
                <ArrowsPointingOutIcon color={Colors.white} />
              </StyledIconButton>
            </View>
          ) : null}
          <LoadingSkeleton isLoading={isLoading} firstLoad={false} />
          <View style={styles.detailContainer}>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Deskripsi</Text>
              <View style={{ display: "flex", gap: 4 }}>
                {!isLoading && reportDetail ? (
                  <Text
                    style={styles.detailParagraph}
                    numberOfLines={isExpand ? null : 2}
                  >
                    {reportDetail.description}
                  </Text>
                ) : (
                  <TextSkeleton isLoading={isLoading} numberOfLines={2} />
                )}
                <TouchableOpacity onPress={() => setExpand(!isExpand)}>
                  <Text style={styles.detailExpand}>
                    {isExpand ? "Lihat lebih sedikit" : "Lihat selengkapnya"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Waktu</Text>
              {!isLoading && reportDetail ? (
                <Text style={styles.detailParagraph}>{reportDetail.date}</Text>
              ) : (
                <TextSkeleton isLoading={isLoading} />
              )}
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
            <Text style={styles.counter}>{formatRatingCounter(reportDetail?.rating || 0)}</Text>
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
    position: "relative",
    display: "flex",
    aspectRatio: 1 / 1,
    width: "100%",
    backgroundColor: "#9FA3B8",
    borderRadius: 16,
  },

  imageContent: { width: "100%", height: "100%", borderRadius: 16 },

  imageExpand: {
    backgroundColor: "#00000060",
    position: "absolute",
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

export default DetailPost
