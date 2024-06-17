import { ScrollView, View, Text, Image, StyleSheet, Modal } from "react-native"
import { Colors } from "../../../themes/Colors"
import { useCallback, useEffect, useState } from "react"
import StyledButton from "../../../components/StyledButton"
import CameraScreen from "../../../components/CaptureScreen"
import { StatusBar } from "expo-status-bar"
import * as ImagePicker from "expo-image-picker"
import TextInputField from "../../../components/TextInputField"
import {
  formatTimestamp,
  kMToLongitudes,
  parseMetadataTimestamp,
} from "../../../libs/utils"
import MapThumbnail from "../../../components/MapThumbnail"
import { revGeocode } from "../../../libs/geo"
import { setReport } from "../../../models/reportModel"
import { useAuth } from "../../../contexts/AuthContext"
import { router, useFocusEffect, useNavigation } from "expo-router"
import { StackActions } from "@react-navigation/native"
import { Shadow } from "react-native-shadow-2"
import MapModal from "../../../components/Modal/MapModal"

export default function AddPost() {
  const [isCameraModalVisible, setCameraModalVisible] = useState(false)
  const [mapModalVisible, setMapModalVisible] = useState(false)

  const [result, setResult] = useState(null)
  const [initialRegion, setInitialRegion] = useState(null)

  const [data, setData] = useState({
    description: "",
    image: null,
    location: null,
    timestamp: null,
  })

  const [isLoading, setLoading] = useState(false)

  const navigation = useNavigation()
  const { currentUser } = useAuth()

  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: true,
    })

    if (!result.canceled) {
      setResult(result.assets[0])
    }
  }

  const handleSubmit = async () => {
    if (
      !(
        data.description !== "" &&
        data.image &&
        data.location &&
        data.timestamp
      )
    ) {
      return
    }

    setLoading(true)

    try {
      const {
        GPSLongitude,
        GPSLatitude,
        address,
        subdistrict,
        district,
        city,
        county,
      } = data.location
      const parsedDate = parseMetadataTimestamp(data.timestamp.DateTime)

      await setReport(
        currentUser,
        address,
        subdistrict,
        district,
        city,
        county,
        GPSLongitude,
        GPSLatitude,
        data.image.uri,
        data.description,
        parsedDate
      )

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop())
      }

      router.replace("/")
      setLoading(false)
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      setResult(null)
      setData({
        description: "",
        image: null,
        location: null,
        timestamp: null,
      })
    }, [])
  )

  useEffect(() => {
    const subscribe = async () => {
      if (result) {
        const { GPSLatitude, GPSAltitude, GPSLongitude, DateTime, SubSecTime } =
          result.exif

        const response = await revGeocode({
          latitude: GPSLatitude,
          longitude: GPSLongitude,
        })

        const { label, subdistrict, district, city, county } =
          response.items[0].address

        setData({
          ...data,
          image: result,
          location: {
            GPSLatitude,
            GPSAltitude,
            GPSLongitude,
            address: label,
            subdistrict,
            district,
            city,
            county,
          },
          timestamp: { DateTime, SubSecTime },
        })

        setInitialRegion({
          latitude: parseFloat(GPSLatitude),
          longitude: parseFloat(GPSLongitude),
          latitudeDelta: 0.00001,
          longitudeDelta: kMToLongitudes(1.0, parseFloat(GPSLatitude)),
        })
      }
    }

    subscribe()
  }, [result])

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={!isCameraModalVisible ? Colors.white : "#000"}
        style={!isCameraModalVisible ? "dark" : "light"}
      />
      <Modal
        animationType="slide"
        visible={isCameraModalVisible}
        onRequestClose={() => setCameraModalVisible(!isCameraModalVisible)}
      >
        <CameraScreen
          setResult={setResult}
          setCameraModalVisible={setCameraModalVisible}
        />
      </Modal>
      <MapModal
        visible={mapModalVisible}
        setVisible={setMapModalVisible}
        initialRegion={initialRegion}
      />
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            position: "relative",
            backgroundColor: Colors.lightGray,
          }}
        >
          <View style={styles.container}>
            <View style={{ flex: 1, aspectRatio: 1 }}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                }}
                resizeMode="cover"
                source={
                  !data.image
                    ? require("../../../assets/temp.jpg")
                    : { uri: data.image.uri }
                }
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <StyledButton
                style={{ flexGrow: 1 }}
                title="Buka Kamera"
                onPress={() => setCameraModalVisible(true)}
              />
              {/* <StyledButton
                style={{ flexGrow: 1 }}
                title="Buka Galeri"
                onPress={imagePicker}
              /> */}
            </View>
            {data.image && data.location && data.timestamp && (
              <View style={styles.detailContainer}>
                {/* <Text>{JSON.stringify(result)}</Text> */}
                <View style={{ display: "flex", gap: 8 }}>
                  <Text style={styles.inputLabel}>Deskripsi</Text>
                  <TextInputField
                    value={data.description}
                    setValue={(val) => setData({ ...data, description: val })}
                    type="default"
                    placeholder="Visualisasikan apa yang terjadi"
                    textArea
                  />
                </View>
                <View style={{ display: "flex", gap: 8 }}>
                  <Text style={styles.inputLabel}>Lokasi</Text>
                  <MapThumbnail
                    onExpand={() => setMapModalVisible(true)}
                    initialRegion={{
                      latitude: parseFloat(data.location.GPSLatitude),
                      longitude: parseFloat(data.location.GPSLongitude),
                      latitudeDelta: 0.00001,
                      longitudeDelta: kMToLongitudes(
                        1.0,
                        parseFloat(data.location.GPSLatitude)
                      ),
                    }}
                  />
                  <Text style={styles.inputText}>{data.location.address}</Text>
                </View>
                <View style={{ display: "flex", gap: 8 }}>
                  <Text style={styles.inputLabel}>Waktu</Text>
                  <Text style={styles.inputText}>
                    {formatTimestamp(
                      parseMetadataTimestamp(data.timestamp.DateTime)
                    )}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <Shadow
          style={{ width: "100%" }}
          offset={[0, -1]}
          distance={8}
          startColor={Colors.shadow}
        >
          <View style={styles.footerContainer}>
            <StyledButton
              loading
              disabled={isLoading}
              onPress={handleSubmit}
              title="Tambah Laporan"
            />
          </View>
        </Shadow>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1 / 1,
  },

  imageContent: { width: "100%", height: "100%", borderRadius: 16 },

  detailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
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

  inputLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
  },

  inputText: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
  },

  footerContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
})
