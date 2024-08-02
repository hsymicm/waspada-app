import { useCallback, useEffect, useRef, useState } from "react"
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from "react-native"

import { Colors } from "../themes/Colors"

import { getReports } from "../models/reportModel"
import Card from "../components/Card"
import CardSkeleton from "../components/Skeleton/CardSkeleton"
import { useLocalSearchParams } from "expo-router"
import { showToast } from "../libs/utils"

export default function PopularFeed({ currentUser }) {
  const { _filter, _date }: any = useLocalSearchParams()

  const [reports, setReports] = useState([])
  const [lastReport, setLastReport] = useState(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isRefresh, setRefresh] = useState<boolean>(false)
  const [visibleReports, setVisibleReports] = useState<string[]>([])

  const fetchAllReports = async (date?: string | null) => {
    try {
      setReports([])
      setLoading(true)

      const dateFilter = date && date !== "" ? new Date(date) : null
      const res = await getReports.firstBatch({
        order: "voteCounter",
        date: dateFilter
      })

      if (res.data.length > 0) {
        setReports(res.data)
        setLastReport(res.lastKey)
      } else {
        showToast("Tidak ada laporan kecelakaan...")
      }

    } catch (error) {
      showToast("Gagal memuat laporan")
      console.log(error?.message || "An error has occured")
    } finally {
      setLoading(false)
    }
  }

  const onEnd = async () => {
    if (isLoading || !lastReport) return
    
    try {
      setLoading(true)
      const dateFilter = _date && _date !== "" ? new Date(_date) : null

      const res = await getReports.nextBatch(lastReport, {
        order: "voteCounter",
        date: dateFilter
      })
      
      setReports([...reports, ...res.data])
      setLastReport(res.lastKey ? res.lastKey : null)
    } catch (error) {
      showToast("Gagal memuat laporan")
      console.log(error?.message || "An error has occured")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefresh(true)
    setReports([])
    setLastReport(null)
    await fetchAllReports(_date)
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
    fetchAllReports(_date)
  }, [_filter, _date])

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
            isDateElapsed={_date && _date !== "" ? false : true}
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
