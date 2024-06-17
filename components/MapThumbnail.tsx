import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps"
import StyledIconButton from "./StyledIconButton"
import { View, StyleSheet } from "react-native"
import { useRef } from "react"
import { Colors } from "../themes/Colors"
import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
} from "react-native-heroicons/solid"

export default function MapThumbnail({ initialRegion, onExpand }) {
  const mapRef = useRef(null)

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        scrollEnabled={false}
      >
        <MapMarker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          title={"Lokasi Laporan"}
        />
      </MapView>
      <StyledIconButton
        onPress={onExpand}
        width={36}
        style={{
          backgroundColor: "#00000060",
          borderRadius: 12,
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <ArrowsPointingOutIcon size={18} color={Colors.white} />
      </StyledIconButton>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },

  map: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
})
