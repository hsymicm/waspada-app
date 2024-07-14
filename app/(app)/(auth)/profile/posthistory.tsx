import { View, FlatList, RefreshControl } from "react-native"
import { Colors } from "../../../../themes/Colors"
import FlatCard from "../../../../components/FlatCard"
import TextSkeleton from "../../../../components/Skeleton/TextSkeleton"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { useAuth } from "../../../../contexts/AuthContext"
import { getReportsHistory } from "../../../../models/profileModel"

export default function ReportHistory() {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isRefresh, setRefresh] = useState(false)

  const { currentUser } = useAuth()

  const onRefresh = async () => {
    setRefresh(true)
    setData([])
    await fetchHistory()
    setRefresh(false)
  }

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const result = await getReportsHistory(currentUser)
      setData(result)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [])
  )

  return (
    <FlatList
      style={{
        backgroundColor: Colors.lightGray,
      }}
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
      data={data}
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
