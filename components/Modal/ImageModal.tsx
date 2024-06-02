import React, { useEffect, useState } from "react"
import { Modal, View, Image, ScrollView, ActivityIndicator } from "react-native"
import StyledIconButton from "../StyledIconButton"
import { XMarkIcon } from "react-native-heroicons/solid"
import { Colors } from "../../themes/Colors"

const ImageModal = ({ imageModalVisible, setImageModalVisible, url }) => {
  const [aspectRatio, setAspectRatio] = useState(null)

  useEffect(() => {
    if (url) {
      Image.getSize(url, (width, height) => {
        setAspectRatio(width / height)
      })
    }
  }, [url])

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={imageModalVisible}
      onRequestClose={() => setImageModalVisible(!imageModalVisible)}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View style={{ position: "relative", width: "100%", elevation: 1 }}>
            {aspectRatio ? (
              <Image
                style={{
                  width: "100%",
                  height: undefined,
                  aspectRatio: aspectRatio,
                  borderRadius: 8,
                }}
                source={{ uri: url }}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator size="large" color={Colors.white} />
            )}
            <StyledIconButton
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "#00000060",
                borderRadius: 8,
              }}
              width={36}
              onPress={() => setImageModalVisible(!imageModalVisible)}
            >
              <XMarkIcon color={Colors.white} />
            </StyledIconButton>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}

export default ImageModal
