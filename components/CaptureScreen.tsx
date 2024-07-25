import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native"
import * as Location from "expo-location"
import {
  Camera,
  CameraType,
  FlashMode,
  ImageType,
  VideoQuality,
} from "expo-camera"
import { ResizeMode, Video } from "expo-av"
import {
  Image as ImageCompressor,
  Video as VideoCompressor,
  createVideoThumbnail,
  getVideoMetaData,
  getFileSize,
} from "react-native-compressor"

import {
  XMarkIcon,
  BoltIcon,
  BoltSlashIcon,
  CameraIcon,
  VideoCameraIcon,
  StopIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"

export default function CameraScreen({ setCameraModalVisible, setResult }) {
  // Location Permissions
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions()

  // Camera Permissions
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions()

  // Microphone Permissions
  const [microphonePermission, requestMicrophonePermission] =
    Camera.useMicrophonePermissions()

  // Camera Options
  const [isFlash, setFLash] = useState(false)
  const [isPhoto, setIsPhoto] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [displayTimer, setDisplayTimer] = useState(0)

  // Results
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)

  const [location, setLocation] = useState(null)

  // Screen Ratios
  const [imagePadding, setImagePadding] = useState(0)
  const [ratio, setRatio] = useState("4:3")
  const { height, width } = Dimensions.get("window")
  const screenRatio = height / width
  const [isRatioSet, setIsRatioSet] = useState(false)

  const [isLoading, setLoading] = useState(false)

  const cameraRef = useRef(null)
  const videoRef = useRef(null)

  const prepareRatio = async () => {
    let desiredRatio = "4:3"

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

  const takeVideo = async () => {
    setIsRecording(true)
    const data = await cameraRef.current.recordAsync({
      maxDuration: 35,
      quality: VideoQuality["1080p"],
      videoBitrate: 1 * 1000 * 1000,
    })
    setVideo(data)
  }

  const stopVideo = async () => {
    await cameraRef.current.stopRecording()

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    setIsRecording(false)

    const locData = {
      GPSLatitude: loc.coords.latitude,
      GPSLongitude: loc.coords.longitude,
      GPSAltitude: loc.coords.altitude,
    }

    setLocation(locData)
  }

  const handleVideoControls = async () => {
    if (isRecording) {
      await stopVideo()
    } else {
      await takeVideo()
    }
  }

  const compressResult = async () => {
    if (!location) return

    setLoading(true)

    if (isPhoto) {
      const compress = await ImageCompressor.compress(image.uri, {
        returnableOutputType: "uri",
      })

      const size = await getFileSize(compress)

      const final = {
        ...image,
        type: isPhoto ? "photo" : "video",
        uri: compress,
        size,
        exif: { ...image.exif, ...location },
      }

      setResult(final)
    } else {
      const thumbnail = await createVideoThumbnail(video.uri)
      const { height, mime, path, width } = thumbnail

      const compress = await VideoCompressor.compress(video.uri, {
        compressionMethod: "auto",
      })
      const { creationTime, extension }: any = await getVideoMetaData(video.uri)
      const compressedSize = await getFileSize(compress)

      const final = {
        type: isPhoto ? "photo" : "video",
        ...video,
        uri: compress,
        size: compressedSize,
        thumbnail: {
          height,
          width,
          uri: path,
          mime,
        },
        extension,
        exif: { ...location, DateTime: creationTime },
      }

      // console.log(final)
      setResult(final)
    }

    setLoading(false)
  }

  const handleOnSubmit = async () => {
    await compressResult()
    setCameraModalVisible(false)
  }

  const handleOnReset = () => {
    setImage(null)
    setVideo(null)
    setLocation(null)
  }

  const formatTimer = (seconds: number): string => {
    if (!isNaN(seconds)) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      const formattedMinutes = String(minutes).padStart(2, "0")
      const formattedSeconds = String(remainingSeconds).padStart(2, "0")

      return `${formattedMinutes}:${formattedSeconds}`
    }

    return "00:00"
  }

  useEffect(() => {
    if (!isRecording) return

    setDisplayTimer(0)

    const start = Date.now()

    const interval = setInterval(() => {
      setDisplayTimer((prevTimer) => {
        const elapsed = Math.floor((Date.now() - start) / 1000)
        if (elapsed < 30) return elapsed

        clearInterval(interval)
        stopVideo()
        return prevTimer
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRecording])

  if (!cameraPermission && !locationPermission) {
    return <View />
  }

  if (
    !cameraPermission?.granted ||
    !locationPermission?.granted ||
    !microphonePermission?.granted
  ) {
    requestCameraPermission()
    requestLocationPermission()
    requestMicrophonePermission()

    return null
  }

  if (image || video) {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "relative",
            marginTop: imagePadding,
            marginBottom: imagePadding,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {isLoading && (
            <View
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 1,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#00000064",
              }}
            >
              <ActivityIndicator size={48} color={Colors.white} />
              <Text
                style={[styles.text, { marginVertical: 8 }]}
              >{`Mohon tunggu, sedang memproses ${
                isPhoto ? "foto" : "video"
              }...`}</Text>
            </View>
          )}
          {!image && video ? (
            <Video
              ref={videoRef}
              source={{
                uri: video.uri,
              }}
              onLoad={() => videoRef.current.playAsync()}
              resizeMode={ResizeMode.COVER}
              isLooping
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Image
              source={{ uri: image.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}
          {!isLoading && (
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
                  onPress={handleOnReset}
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
          )}
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
              {!isPhoto && isRecording && (
                <View style={styles.timerContainer}>
                  <Text style={styles.text}>{formatTimer(displayTimer)}</Text>
                </View>
              )}
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
              {!isRecording && (
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
                          color:
                            isPhoto === false ? Colors.black : Colors.white,
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
              )}
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
                      <CameraIcon size={32} color="#454545" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleVideoControls}
                      style={styles.cameraControlButton}
                    >
                      {isRecording ? (
                        <StopIcon size={32} color="#454545" />
                      ) : (
                        <VideoCameraIcon size={32} color="#f54545" />
                      )}
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
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 76,
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 99,
  },
  timerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 32,
    backgroundColor: "#f54545",
  },
})
