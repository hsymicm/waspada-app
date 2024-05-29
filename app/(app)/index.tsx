import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  RefreshControl,
} from "react-native"

import { Colors } from "../../themes/Colors"
import { MapPinIcon as Pin } from "react-native-heroicons/solid"

import { useAuth } from "../../contexts/AuthContext"
import { getReports } from "../../models/reportModel"

import Card from "../../components/Card"
import LoadingSkeleton from "../../components/LoadingSkeleton"

function LocationComponent() {
  return (
    <View style={styles.locationContainer}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          marginBottom: 2,
          marginLeft: -1,
        }}
      >
        <Pin color={Colors.accent} />
        <Text numberOfLines={1} style={styles.heading}>
          Cipinang Melayu, Makasar
        </Text>
      </View>
      <Text style={styles.subHeading}>
        Menampilkan kecelakaan di sekitar lokasi Anda
      </Text>
    </View>
  )
}

export default function HomeScreen() {
  const { currentUser, userSignOut } = useAuth()
  const [reports, setReports] = useState([])
  const [lastReport, setLastReport] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [isRefresh, setRefresh] = useState(false)
  const [value, setValue] = useState("")

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(["guest", "not_first_time"])
      router.replace("/signin")
      if (currentUser) await userSignOut()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const res = await getReports.firstBatch()
    setReports(res.data)
    setLastReport(res.lastKey)
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefresh(true)
    setReports([])
    setLastReport(null)
    await fetchData()
    setRefresh(false)
  }

  const onEnd = async () => {
    if (!isLoading && lastReport) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const res = await getReports.nextBatch(lastReport)
      setReports([...reports, ...res.data])
      setLastReport(res.lastKey ? res.lastKey : null)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <FlatList
      initialNumToRender={5}
      style={{ backgroundColor: Colors.lightGray }}
      contentContainerStyle={styles.container}
      data={reports}
      keyExtractor={(item, _) => item.uid}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.8}
      onEndReached={onEnd}
      ListHeaderComponent={<LocationComponent />}
      ListFooterComponent={
        <>
          <LoadingSkeleton
            isLoading={isLoading}
            firstLoad={lastReport ? false : true}
          />
          <Text style={styles.text}>
            Hello World! 🎉{" "}
            {currentUser ? JSON.stringify(currentUser?.email) : "Guest"}
          </Text>
          <Button title="Keluar" onPress={handleSignOut} />
        </>
      }
      renderItem={({ item }) => (
        <Card
          rating={item.rating}
          description={item.description}
          date={item.date}
          location={item.location}
          url={item.url}
          reportedAlot={item.many}
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
  )
}

const styles = StyleSheet.create({
  locationContainer: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  heading: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: Colors.accent,
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
