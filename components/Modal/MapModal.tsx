import { Modal, View, StyleSheet, ActivityIndicator } from "react-native"
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
} from "react-native-heroicons/solid"
import StyledIconButton from "../StyledIconButton"
import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps"
import { useRef } from "react"
import { Colors } from "../../themes/Colors"

export default function MapModal({ visible, setVisible, initialRegion }) {
  const mapRef = useRef(null)

  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000)
    }
  }
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={() => setVisible(!visible)}
    >
      {initialRegion ? (
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      )}
      <View
        style={{
          position: "absolute",
          top: 48,
          right: 32,
          display: "flex",
          gap: 16,
        }}
      >
        <StyledIconButton
          onPress={() => setVisible(false)}
          width={46}
          style={{
            backgroundColor: "#00000060",
            borderRadius: 16,
          }}
        >
          <ArrowsPointingInIcon size={24} color={Colors.white} />
        </StyledIconButton>
        {initialRegion && (
          <StyledIconButton
            onPress={centerMap}
            width={46}
            style={{
              backgroundColor: "#00000060",
              borderRadius: 16,
            }}
          >
            <ArrowPathIcon size={24} color={Colors.white} />
          </StyledIconButton>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "100%",
  },

  map: {
    width: "100%",
    height: "100%",
  },
})
