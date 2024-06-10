import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps"
import StyledIconButton from "./StyledIconButton"
import { View, StyleSheet } from "react-native"
import { useRef } from "react"
import { Colors } from "../themes/Colors"
import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
} from "react-native-heroicons/solid"

export default function MapThumbnail({ initialRegion }) {
  const mapRef = useRef(null)

  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000) // Duration in ms
    }
  }
  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
      >
        <MapMarker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          title={"Lokasi Laporan"}
        />
      </MapView>
      <View
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          gap: 8,
        }}
      >
        <StyledIconButton
          onPress={() => {}}
          width={36}
          style={{
            backgroundColor: "#00000060",
            borderRadius: 12,
          }}
        >
          <ArrowsPointingOutIcon size={18} color={Colors.white} />
        </StyledIconButton>
        <StyledIconButton
          onPress={centerMap}
          width={36}
          style={{
            backgroundColor: "#00000060",
            borderRadius: 12,
          }}
        >
          <ArrowPathIcon size={18} color={Colors.white} />
        </StyledIconButton>
      </View>
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
