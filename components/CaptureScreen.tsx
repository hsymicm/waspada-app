import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native"
import * as Location from "expo-location"
import { Camera, CameraType, FlashMode, ImageType } from "expo-camera"
import { Video } from "expo-av"
import {
  Image as ImageCompressor,
  Video as VideoCompressor,
} from "react-native-compressor"

import {
  XMarkIcon,
  BoltIcon,
  BoltSlashIcon,
  CameraIcon,
  VideoCameraIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"

export default function CameraScreen({ setCameraModalVisible, setResult }) {
  // Location Permissions
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions()

  // Camera Permissions
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions()

  // Camera Options
  const [isFlash, setFLash] = useState(false)
  const [isPhoto, setIsPhoto] = useState(true)

  const [compressedImage, setCompressedImage] = useState(null)
  const [compressedVideo, setCompressedVideo] = useState(null)

  // Results
  const [image, setImage] = useState(null)

  const [location, setLocation] = useState(null)

  // Screen Ratios
  const [imagePadding, setImagePadding] = useState(0)
  const [ratio, setRatio] = useState("4:3")
  const { height, width } = Dimensions.get("window")
  const screenRatio = height / width
  const [isRatioSet, setIsRatioSet] = useState(false)

  const cameraRef = useRef(null)

  if (!cameraPermission && !locationPermission) {
    return <View />
  }

  const prepareRatio = async () => {
    let desiredRatio = "4:3" // Start with the system default

    if (Platform.OS === "android") {
      const ratios = await cameraRef.current.getSupportedRatiosAsync()

      let distances = {}
      let realRatios = {}
      let minDistance = null
      for (const ratio of ratios) {
        const parts = ratio.split(":")
        const realRatio = parseInt(parts[0]) / parseInt(parts[1])
        realRatios[ratio] = realRatio
        const distance = screenRatio - realRatio
        distances[ratio] = distance
        if (minDistance == null) {
          minDistance = ratio
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio
          }
        }
      }

      desiredRatio = minDistance
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      )

      setImagePadding(remainder)
      setRatio(desiredRatio)
      setIsRatioSet(true)
    }
  }

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio()
    }
  }

  if (!cameraPermission?.granted) {
    requestCameraPermission()

    return null
  }

  if (!locationPermission?.granted) {
    requestLocationPermission()

    return null
  }

  const takePicture = async () => {
    if (isRatioSet) {
      const data = await cameraRef.current.takePictureAsync({
        exif: true,
        quality: 0,
        imageType: ImageType.jpg,
        skipProcessing: true,
      })

      setImage(data)

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const locData = {
        GPSLatitude: loc.coords.latitude,
        GPSLongitude: loc.coords.longitude,
        GPSAltitude: loc.coords.altitude,
      }

      setLocation(locData)
    }
  }

  const compressResult = async () => {
    if (!location) return

    if (isPhoto) {
      const compress = await ImageCompressor.compress(image.uri, {
        returnableOutputType: "uri",
      })

      const final = {
        ...image,
        uri: compress,
        exif: { ...image.exif, ...location },
      }
      console.log(final)
      setResult(final)
    } else {
      return
    }
  }

  const handleOnSubmit = async () => {
    await compressResult()
    setCameraModalVisible(false)
  }

  if (image) {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "relative",
            marginTop: imagePadding,
            marginBottom: imagePadding,
          }}
        >
          <Image
            source={{ uri: image.uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              padding: 16,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                padding: 8,
                gap: 16,
                backgroundColor: "#00000064",
                borderRadius: 99,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setImage(null)}
                style={{ padding: 16 }}
              >
                <Text style={[styles.text, { fontSize: 18 }]}>Ulangi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleOnSubmit}
                style={{ padding: 16 }}
              >
                <Text style={[styles.text, { fontSize: 18 }]}>Lanjut</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        onCameraReady={setCameraReady}
        ratio={ratio}
        type={CameraType.back}
        flashMode={
          isFlash && isPhoto
            ? FlashMode.on
            : isFlash && !isPhoto
            ? FlashMode.torch
            : FlashMode.off
        }
        style={[
          styles.camera,
          { marginTop: imagePadding, marginBottom: imagePadding },
        ]}
      >
        {isRatioSet && (
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={() => setCameraModalVisible(false)}
              >
                <XMarkIcon size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.button,
                  isFlash && { backgroundColor: Colors.white },
                ]}
                onPress={() => setFLash(!isFlash)}
              >
                {!isFlash ? (
                  <BoltSlashIcon size={20} color={Colors.white} />
                ) : (
                  <BoltIcon size={20} color={Colors.black} />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <View style={styles.cameraMenuContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPhoto(false)}
                  style={[
                    styles.capsuleButton,
                    isPhoto === false && { backgroundColor: Colors.white },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isPhoto === false ? Colors.black : Colors.white,
                      },
                    ]}
                  >
                    Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPhoto(true)}
                  style={[
                    styles.capsuleButton,
                    isPhoto === true && { backgroundColor: Colors.white },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isPhoto === true ? Colors.black : Colors.white,
                      },
                    ]}
                  >
                    Foto
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cameraControlContainer}>
                <View
                  style={{
                    padding: 8,
                    borderRadius: 99,
                    backgroundColor: "#00000032",
                  }}
                >
                  {isPhoto ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={takePicture}
                      style={styles.cameraControlButton}
                    >
                      <CameraIcon size={24} color="#454545" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.cameraControlButton}
                    >
                      <VideoCameraIcon size={24} color="#f54545" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </>
        )}
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#00000032",
  },
  text: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: Colors.white,
  },
  cameraMenuContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    // gap: 4,
    padding: 8,
    backgroundColor: "#00000032",
    borderRadius: 32,
  },
  capsuleButton: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 32,
  },
  cameraControlContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    height: 121,
  },
  cameraControlButton: {
    padding: 24,
    // aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 99,
  },
})
