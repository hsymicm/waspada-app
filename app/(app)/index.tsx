import { useCallback, useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native"

import { Colors } from "../../themes/Colors"
import { MapPinIcon as Pin, PlusIcon } from "react-native-heroicons/solid"

import { getReports, getReportsByLocation } from "../../models/reportModel"

import Card from "../../components/Card"
import CardSkeleton from "../../components/Skeleton/CardSkeleton"
import * as Location from "expo-location"
import { revGeocode } from "../../libs/geo"
import { router, useNavigation } from "expo-router"
import { Shadow } from "react-native-shadow-2"
import { useAuth } from "../../contexts/AuthContext"

function LocationComponent({ address }: { address: string | null }) {
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
          {address || "-"}
        </Text>
      </View>
      <Text style={styles.subHeading}>
        Menampilkan kecelakaan di sekitar lokasi Anda
      </Text>
    </View>
  )
}

export default function HomeScreen() {
  const [reports, setReports] = useState([])
  const [lastReport, setLastReport] = useState(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isRefresh, setRefresh] = useState<boolean>(false)
  const [value, setValue] = useState("")

  const [currentAddress, setcurrentAddress] = useState<string | null>(null)
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions()

  const navigation = useNavigation()
  const { currentUser } = useAuth()

  const fetchData = async () => {
    setLoading(true)
    const res = await getReports.firstBatch()
    setReports(res.data)
    setLastReport(res.lastKey)
    setLoading(false)
  }

  const fetchNearbyReports = async () => {
    setLoading(true)
    try {
      const coords = await getCurrentLocation()
      const response = await getReportsByLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        radiusInKm: 10,
      })
      setReports(response)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const onRefresh = async () => {
    setRefresh(true)
    setReports([])
    setLastReport(null)
    await fetchNearbyReports()
    setRefresh(false)
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

  const getCurrentLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    const latitude = loc.coords.latitude
    const longitude = loc.coords.longitude

    const response = await revGeocode({
      latitude,
      longitude,
    })

    const { subdistrict, district } = response.items[0].address
    const address = response ? `${subdistrict}, ${district}` : null

    setcurrentAddress(address)

    return { latitude, longitude }
  }

  useEffect(() => {
    fetchNearbyReports()
  }, [])

  if (!locationPermission) {
    return <View />
  }

  if (!locationPermission.granted) {
    requestLocationPermission()

    return null
  }

  return (
    <View style={{ position: "relative" }}>
      <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={{ backgroundColor: Colors.lightGray }}
        contentContainerStyle={styles.container}
        data={reports}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        // onEndReachedThreshold={0.8}
        // onEndReached={onEnd}
        ListHeaderComponent={<LocationComponent address={currentAddress} />}
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
            url={item.imageUrl}
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
