import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Colors } from "../../../themes/Colors"
import {
  ExclamationCircleIcon,
  ArrowsPointingOutIcon,
  ShareIcon,
  BookmarkIcon,
} from "react-native-heroicons/solid"
import { BookmarkIcon as BookmarkIconOutline } from "react-native-heroicons/outline"
import StyledIconButton from "../../../components/StyledIconButton"
import { useCallback, useEffect, useRef, useState } from "react"
import { kMToLongitudes } from "../../../libs/utils"
import { useLocalSearchParams } from "expo-router"
import {
  downloadAndShareFile,
  getReportDetail,
} from "../../../models/reportModel"
import LoadingSkeleton from "../../../components/Skeleton/CardSkeleton"
import TextSkeleton from "../../../components/Skeleton/TextSkeleton"
import ImageModal from "../../../components/Modal/ImageModal"
import { useAuth } from "../../../contexts/AuthContext"
import VoteCounter from "../../../components/VoteCounter"
import MapThumbnail from "../../../components/MapThumbnail"
import MapModal from "../../../components/Modal/MapModal"
import {
  handleArchiveReport,
  hasUserArchivedReport,
} from "../../../models/profileModel"
import { StatusBar } from "expo-status-bar"
import VideoModal from "../../../components/Modal/VideoModal"
import VideoPlayer from "../../../components/VideoPlayer"

function DetailPost() {
  const { id }: any = useLocalSearchParams()

  const [isExpand, setExpand] = useState(false)
  const [enableExpand, setEnableExpand] = useState(false)

  const [reportDetail, setReportDetail] = useState(null)
  const [hasArchived, setHasArchived] = useState(false)
  const [initialRegion, setInitialRegion] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [sourceModalVisible, setSourceModalVisible] = useState(false)
  const [mapModalVisible, setMapModalVisible] = useState(false)

  const { currentUser } = useAuth()

  const fetchReportDetail = async (id: any) => {
    setLoading(true)

    try {
      const data: any = await getReportDetail(id)
      setInitialRegion({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        latitudeDelta: 0.00001,
        longitudeDelta: kMToLongitudes(1.0, parseFloat(data.latitude)),
      })
      setReportDetail(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const onTextLayout = useCallback((e: any) => {
    setEnableExpand(e.nativeEvent.lines.length > 2)
  }, [])

  const handleArchiveSubmit = async () => {
    setActionLoading(true)
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
      setActionLoading(false)
    }
  }

  const handleShare = async (url: string, filename: string) => {
    setActionLoading(true)
    try {
      console.log("sharing...")
      await downloadAndShareFile(url, filename)
    } catch (error) {
      console.log(error)
    } finally {
      setActionLoading(false)
    }
  }

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
      fetchReportDetail(id)
      checkUserHasArchived()
    }
  }, [currentUser, id])

  return (
    <>
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            position: "relative",
            backgroundColor: Colors.lightGray,
          }}
        >
          <View style={styles.container}>
            {reportDetail?.type === "video" ? (
              <VideoModal
                visible={sourceModalVisible}
                setVisible={setSourceModalVisible}
                url={reportDetail?.videoUrl}
                thumbnail={reportDetail?.thumbnail}
              />
            ) : (
              <ImageModal
                visible={sourceModalVisible}
                setVisible={setSourceModalVisible}
                url={reportDetail?.imageUrl}
              />
            )}
            <MapModal
              visible={mapModalVisible}
              setVisible={setMapModalVisible}
              initialRegion={initialRegion}
            />
            {!isLoading && reportDetail?.many && (
              <View style={styles.headerNotification}>
                <ExclamationCircleIcon color={Colors.white} />
                <Text style={styles.headerText}>
                  Terdapat banyak laporan di area yang sama
                </Text>
              </View>
            )}
            {!isLoading &&
            (reportDetail?.imageUrl || reportDetail?.videoUrl) ? (
              <View style={styles.imageContainer}>
                {reportDetail?.type === "photo" || !reportDetail?.type ? (
                  <Image
                    style={styles.imageContent}
                    source={{
                      uri: reportDetail.imageUrl,
                    }}
                  />
                ) : (
                  <VideoPlayer
                    source={reportDetail?.videoUrl}
                    thumbnail={reportDetail?.thumbnail}
                    shouldPlay={!(sourceModalVisible || mapModalVisible)}
                    styles={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "black",
                    }}
                    resizeMode="cover"
                  />
                )}

                <StyledIconButton
                  onPress={() => setSourceModalVisible(true)}
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
                      onTextLayout={onTextLayout}
                      style={styles.detailParagraph}
                      numberOfLines={isExpand ? null : 2}
                    >
                      {reportDetail.description}
                    </Text>
                  ) : (
                    <TextSkeleton isLoading={isLoading} numberOfLines={2} />
                  )}
                  {enableExpand && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setExpand(!isExpand)}
                    >
                      <Text style={styles.detailExpand}>
                        {isExpand
                          ? "Lihat lebih sedikit"
                          : "Lihat selengkapnya"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {reportDetail?.latitude && reportDetail?.longitude && (
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Lokasi</Text>
                  <MapThumbnail
                    onExpand={() => setMapModalVisible(true)}
                    initialRegion={initialRegion}
                  />
                  <Text style={styles.detailParagraph}>
                    {reportDetail.address}
                  </Text>
                </View>
              )}
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Waktu</Text>
                {!isLoading && reportDetail ? (
                  <Text style={styles.detailParagraph}>
                    {reportDetail.date}
                  </Text>
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  handleShare(
                    reportDetail?.type === "video"
                      ? reportDetail?.videoUrl
                      : reportDetail?.imageUrl,
                    `${id}.${reportDetail?.type === "video" ? "mp4" : "jpg"}`
                  )
                }
                disabled={actionLoading}
              >
                <View style={{ padding: 8 }}>
                  <ShareIcon size={16} color={Colors.white} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleArchiveSubmit}
                disabled={actionLoading}
              >
                <View style={{ padding: 8 }}>
                  {hasArchived ? (
                    <BookmarkIcon size={18} color={Colors.white} />
                  ) : (
                    <BookmarkIconOutline size={18} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <VoteCounter
              reportId={id}
              userId={currentUser?.uid}
              rating={reportDetail?.voteCounter}
            />
          </View>
        </View>
      </View>
      <StatusBar
        hidden={sourceModalVisible}
        translucent
        animated
        backgroundColor={Colors.white}
        style="dark"
      />
    </>
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
    overflow: "hidden",
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
    gap: 12,
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
