import { ScrollView, View, Text, Image, StyleSheet, Modal } from "react-native"
import { Colors } from "../../../themes/Colors"
import { useState } from "react"
import StyledButton from "../../../components/StyledButton"
import CameraScreen from "../../../components/CaptureScreen"
import { StatusBar } from "expo-status-bar"

export default function AddPost() {
  const [isCameraModalVisible, setCameraModalVisible] = useState(false)

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
        <CameraScreen setCameraModalVisible={setCameraModalVisible} />
      </Modal>
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            position: "relative",
            backgroundColor: Colors.lightGray,
          }}
        >
          <View style={styles.container}>
            <StyledButton
              title="Ambil Foto"
              onPress={() => setCameraModalVisible(true)}
            />
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <StyledButton title="Tambah Laporan" />
        </View>
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
    padding: 16,
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

  footerContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
})
