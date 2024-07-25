import { View, FlatList, RefreshControl } from "react-native"
import { Colors } from "../../../../themes/Colors"
import FlatCard from "../../../../components/FlatCard"
import TextSkeleton from "../../../../components/Skeleton/TextSkeleton"
import { useFocusEffect } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { useAuth } from "../../../../contexts/AuthContext"
import { getArchiveReports } from "../../../../models/profileModel"
import { showToast } from "../../../../libs/utils"

export default function PostArchive() {
  const [data, setData] = useState([])
  const [lastKey, setLastKey] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [isRefresh, setRefresh] = useState(false)
  const [visibleReports, setVisibleReports] = useState<string[]>([])

  const { currentUser } = useAuth()

  const onRefresh = async () => {
    setRefresh(true)
    setData([])
    setLastKey(null)
    await fetchArchive()
    setRefresh(false)
  }

  const fetchArchive = async () => {
    try {
      setLoading(true)
      const result = await getArchiveReports.firstBatch(currentUser)
      setData(result.data)
      setLastKey(result.lastKey)
    } catch (error) {
      showToast("Gagal memuat riwayat laporan")
      console.log(error?.message || "An error has occured")
    } finally {
      setLoading(false)
    }
  }

  const onEnd = async () => {
    if (isLoading || !lastKey) return

    try {
      setLoading(true)
      const result = await getArchiveReports.nextBatch(currentUser, lastKey)
      setData((prevData) => [...prevData, ...result.data])
      setLastKey(result.lastKey)
    } catch (error) {
      showToast("Gagal memuat riwayat laporan")
      console.log(error?.message || "An error has occured")
    } finally {
      setLoading(false)
    }
  }

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 1000,
  }

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setVisibleReports(viewableItems.map((viewable) => viewable.item.uid))
  }, [])

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ])

  useFocusEffect(
    useCallback(() => {
      fetchArchive()
    }, [])
  )

  return (
    <FlatList
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      viewabilityConfig={viewabilityConfig}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      style={{
        backgroundColor: Colors.lightGray,
      }}
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
      data={data}
      onEndReachedThreshold={0.9}
      onEndReached={onEnd}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FlatCard
          id={item.id}
          image={item?.type === "video" ? item.thumbnail : item.imageUrl}
          date={item.date}
          location={`${item.subdistrict}, ${item.district}`}
          description={item.description}
        />
      )}
      ListFooterComponent={() => (
        <View style={{ gap: 16 }}>
          <TextSkeleton
            style={{ width: "100%", height: 102 }}
            borderRadius={16}
            isLoading={isLoading}
          />
          <TextSkeleton
            style={{ width: "100%", height: 102 }}
            borderRadius={16}
            isLoading={isLoading}
          />
        </View>
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefresh}
          onRefresh={onRefresh}
          colors={[Colors.accent]}
          progressBackgroundColor={Colors.white}
        />
      }
    />
  )
}
