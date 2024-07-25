import { ResizeMode, Video } from "expo-av"
import { memo, useEffect, useRef, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Colors } from "../themes/Colors"

function VideoPlayer({
  source,
  thumbnail,
  shouldPlay,
  thumbnailResizeMode = "contain",
  resizeMode = "contain",
  styles = {},
}) {
  const [isLoading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!status) return

    if (status.isPlaying && !shouldPlay) {
      videoRef.current.pauseAsync()
    } else {
      videoRef.current.playAsync()
    }
  }, [shouldPlay])

  if (!source || !thumbnail) {
    return null
  }

  return (
    <View style={[{ position: "relative" }, styles]}>
      {isLoading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: 1,
          }}
        >
          <View
            style={{
              padding: 16,
              backgroundColor: "#00000032",
              borderRadius: 99,
            }}
          >
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        </View>
      )}
      <Video
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
        source={{ uri: source }}
        onLoadStart={() => setLoading(true)}
        onLoad={() => videoRef.current.playAsync()}
        onReadyForDisplay={() => setLoading(false)}
        resizeMode={
          resizeMode === "contain" ? ResizeMode.CONTAIN : ResizeMode.COVER
        }
        usePoster
        isLooping
        posterSource={{ uri: thumbnail }}
        posterStyle={{
          resizeMode:
            thumbnailResizeMode === "contain"
              ? ResizeMode.CONTAIN
              : ResizeMode.COVER,
        }}
        onPlaybackStatusUpdate={(status) => setStatus(status)}
      />
    </View>
  )
}

export default memo(VideoPlayer)
