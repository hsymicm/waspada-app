import { useCallback, useEffect, useRef, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native"

import { Colors } from "../themes/Colors"
import { PlusIcon } from "react-native-heroicons/solid"

import { getReports } from "../models/reportModel"
import Card from "../components/Card"
import CardSkeleton from "../components/Skeleton/CardSkeleton"
import { router } from "expo-router"
import { Shadow } from "react-native-shadow-2"

export default function AllFeed({ currentUser }) {
  const [reports, setReports] = useState([])
  const [lastReport, setLastReport] = useState(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isRefresh, setRefresh] = useState<boolean>(false)
  const [visibleReports, setVisibleReports] = useState<string[]>([])

  const fetchData = async () => {
    setLoading(true)
    const res = await getReports.firstBatch()
    setReports(res.data)
    setLastReport(res.lastKey)
    setLoading(false)
  }
  const onEnd = async () => {
    if (!isLoading && lastReport) {
      setLoading(true)
      const res = await getReports.nextBatch(lastReport)
      setReports([...reports, ...res.data])
      setLastReport(res.lastKey ? res.lastKey : null)
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefresh(true)
    setReports([])
    setLastReport(null)
    await fetchData()
    setRefresh(false)
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

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <FlatList
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={{ backgroundColor: Colors.lightGray }}
        contentContainerStyle={styles.container}
        data={reports}
        onEndReachedThreshold={0.9}
        onEndReached={onEnd}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <CardSkeleton
            isLoading={isLoading}
            firstLoad={lastReport ? false : true}
          />
        }
        renderItem={({ item }) => (
          <Card
            id={item.uid}
            rating={item.voteCounter}
            description={item.description}
            date={item.date}
            location={`${item.subdistrict}, ${item.district}, ${item.city}.`}
            url={
              item?.type === "photo" || !item?.type
                ? item.imageUrl
                : item.videoUrl
            }
            type={item?.type}
            reportedAlot={item.many}
            isVisible={visibleReports.includes(item.uid)}
            thumbnail={item?.thumbnail}
          />
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
      {currentUser && (
        <TouchableOpacity
          onPress={() => router.navigate("/(auth)/addpost")}
          activeOpacity={1}
          style={{ position: "absolute", bottom: 48, right: 36 }}
        >
          <Shadow offset={[0, 2]} distance={4} startColor={Colors.shadow}>
            <View
              style={{
                backgroundColor: Colors.primary,
                padding: 16,
                borderRadius: 32,
              }}
            >
              <PlusIcon size={28} color={Colors.white} />
            </View>
          </Shadow>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  heading: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: Colors.accent,
    marginBottom: 2,
  },
  subHeading: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
  },
  text: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
  },
  container: {
    padding: 16,
    gap: 16,
  },
})
