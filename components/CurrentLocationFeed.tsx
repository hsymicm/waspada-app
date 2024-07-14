import { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native"

import { Colors } from "../themes/Colors"
import { MapPinIcon as Pin, PlusIcon } from "react-native-heroicons/solid"

import { getReportsByLocation } from "../models/reportModel"
import { useLocalSearchParams } from "expo-router"

import Card from "../components/Card"
import CardSkeleton from "../components/Skeleton/CardSkeleton"
import * as Location from "expo-location"
import { geocode, revGeocode } from "../libs/geo"
import { router } from "expo-router"
import { Shadow } from "react-native-shadow-2"
import TextSkeleton from "./Skeleton/TextSkeleton"
import { showToast } from "../libs/utils"

function LocationComponent({
  address,
  search,
  loading,
}: {
  address: string | null
  search: string | undefined | null
  loading: boolean
}) {
  return (
    <View style={styles.locationContainer}>
      <Pin color={Colors.accent} />
      <View style={{ flex: 1 }}>
        {!loading ? (
          <Text numberOfLines={1} style={styles.heading}>
            {address}
          </Text>
        ) : (
          <TextSkeleton
            style={{ marginBottom: 8, height: 24, width: "90%" }}
            isLoading={loading}
          />
        )}
        {!loading ? (
          <Text style={styles.subHeading}>
            Menampilkan kecelakaan di sekitar lokasi{" "}
            {search && search !== "" ? "pencarian" : "Anda"}
          </Text>
        ) : (
          <TextSkeleton isLoading={loading} />
        )}
      </View>
    </View>
  )
}

export default function CurrentLocationFeed({ currentUser }) {
  const { _filter, _search, _date }: any = useLocalSearchParams()

  const [reports, setReports] = useState([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isRefresh, setRefresh] = useState<boolean>(false)

  const [currentAddress, setcurrentAddress] = useState(null)
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions()

  const formatAddress = (obj: any) => {
    const { subdistrict, district, city, county, countryName } = obj

    if (subdistrict && district) {
      return `${subdistrict}, ${district}`
    } else if (district && city) {
      return `${district}, ${city}`
    } else if (city && county) {
      return `${city}, ${county}`
    } else {
      return `${county}, ${countryName}`
    }
  }

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const latitude = loc.coords.latitude
      const longitude = loc.coords.longitude
      const response = await revGeocode({
        latitude,
        longitude,
      })

      const obj = response.items[0].address
      const formattedAddress = formatAddress(obj)

      setcurrentAddress(formattedAddress)

      return { latitude, longitude }
    } catch (error) {
      throw new Error(error?.message || "Error, something happened")
    }
  }

  const getLocationBySearch = async (searchLocation: string | null) => {
    try {
      const response = await geocode({ location: searchLocation })

      const { address, position } = response?.items
        ? response.items[0]
        : response

      const formattedAddress = formatAddress(address)
      setcurrentAddress(formattedAddress)

      return { latitude: position.lat, longitude: position.lng }
    } catch (error) {
      throw new Error(error || "Error, something happened")
    }
  }

  const fetchNearbyReports = async (
    searchLocation?: string | null,
    date?: string | null
  ) => { 
    try {
      setReports([])
      setLoading(true)

      const dateFilter = date && date !== "" ? new Date(date) : null

      const coords =
        searchLocation && searchLocation !== ""
          ? await getLocationBySearch(searchLocation)
          : await getCurrentLocation()

      const response = await getReportsByLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        radiusInKm: 5,
        date: dateFilter,
      })

      setReports(response)
    } catch (error) {
      showToast("Gagal memuat laporan")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefresh(true)
    setReports([])
    await fetchNearbyReports(_search, _date)
    setRefresh(false)
  }

  useEffect(() => {
    fetchNearbyReports(_search, _date)
  }, [_filter, _search, _date])

  if (!locationPermission) {
    return <View />
  }

  if (!locationPermission.granted) {
    requestLocationPermission()

    return null
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={{ backgroundColor: Colors.lightGray }}
        contentContainerStyle={styles.container}
        data={reports}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <LocationComponent
            address={currentAddress}
            search={_search}
            loading={isLoading}
          />
        }
        ListFooterComponent={
          <CardSkeleton isLoading={isLoading} firstLoad={true} />
        }
        renderItem={({ item }) =>
          !isLoading ? (
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
              thumbnail={item?.thumbnail}
            />
          ) : null
        }
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
