import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native"
import { Camera, CameraType } from "expo-camera"
import { Video } from "expo-av"

import {
  XMarkIcon,
  BoltIcon,
  BoltSlashIcon,
  CameraIcon,
  VideoCameraIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"

export default function CameraScreen({ setCameraModalVisible }) {
  // Camera Permissions
  const [permission, requestPermission] = Camera.useCameraPermissions()

  // Camera Options
  const [isFlash, setFLash] = useState(false)
  const [isPhoto, setPhoto] = useState(true)

  // Screen Ratios
  const [imagePadding, setImagePadding] = useState(0)
  const [ratio, setRatio] = useState("4:3")
  const { height, width } = Dimensions.get("window")
  const screenRatio = height / width
  const [isRatioSet, setIsRatioSet] = useState(false)

  const cameraRef = useRef()

  if (!permission) {
    return <View />
  }

  const prepareRatio = async () => {
    let desiredRatio = "4:3" // Start with the system default

    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = await cameraRef.current.getSupportedRatiosAsync()

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {}
      let realRatios = {}
      let minDistance = null
      for (const ratio of ratios) {
        const parts = ratio.split(":")
        const realRatio = parseInt(parts[0]) / parseInt(parts[1])
        realRatios[ratio] = realRatio
        // ratio can't be taller than screen, so we don't want an abs()
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
      // set the best match
      desiredRatio = minDistance
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      )
      // set the preview padding and preview ratio
      setImagePadding(remainder)
      setRatio(desiredRatio)
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true)
    }
  }

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio()
    }
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
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
        style={[
          styles.camera,
          { marginTop: imagePadding, marginBottom: imagePadding },
        ]}
      >
        {isRatioSet && (
          <>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setCameraModalVisible(false)}
              >
                <XMarkIcon size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setFLash(!isFlash)}
              >
                {!isFlash ? (
                  <BoltSlashIcon size={20} color={Colors.white} />
                ) : (
                  <BoltIcon size={20} color={Colors.white} />
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
                  onPress={() => setPhoto(false)}
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
                  onPress={() => setPhoto(true)}
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
                <View style={{
                  padding: 8,
                  borderRadius: 99,
                  backgroundColor: "#00000032",
                }}>
                  {isPhoto ? (
                    <TouchableOpacity style={styles.cameraControlButton}>
                      <CameraIcon size={24} color="#454545" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.cameraControlButton}>
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
