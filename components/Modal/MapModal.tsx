import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native"
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "react-native-heroicons/solid"
import StyledIconButton from "../StyledIconButton"
import MapView, { MapMarker, PROVIDER_GOOGLE } from "react-native-maps"
import { useRef } from "react"
import { Colors } from "../../themes/Colors"

export default function MapModal({
  visible,
  setVisible,
  initialRegion,
  address,
}) {
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
          showsTraffic
        >
          <MapMarker
            coordinate={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
            }}
            tappable={false}
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
          top: 16,
          left: 16,
          display: "flex",
          gap: 8,
        }}
      >
        <StyledIconButton
          onPress={() => setVisible(false)}
          width={46}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 16,
          }}
        >
          <ArrowLeftIcon size={24} color={Colors.secondary} />
        </StyledIconButton>
        {initialRegion && (
          <StyledIconButton
            onPress={centerMap}
            width={46}
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 16,
            }}
          >
            <ArrowPathIcon size={24} color={Colors.primary} />
          </StyledIconButton>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          padding: 16,
        }}
      >
        <View style={styles.detailContainer}>
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Lokasi Laporan Kecelakaan</Text>
            <Text style={styles.detailParagraph}>{address}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `geo:0,0?q=${initialRegion.latitude},${
                  initialRegion.longitude
                }(${"Laporan Kecelakaan"})`
              )
            }
          >
            <View
              style={{
                padding: 4,
                transform: [{ translateX: 5 }, { translateY: -5 }],
              }}
            >
              <ArrowTopRightOnSquareIcon size={20} color={Colors.accent} />
            </View>
          </TouchableOpacity>
        </View>
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

  detailContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 16,
    padding: 16,
  },

  detailInfo: {
    flex: 1,
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
})
