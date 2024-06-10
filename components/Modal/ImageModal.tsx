import React, { useEffect, useState } from "react"
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native"
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => {
            setImageModalVisible(false)
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
            <TouchableWithoutFeedback touchSoundDisabled>
              <View
                style={{ position: "relative", width: "100%", elevation: 1 }}
              >
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
                <TouchableWithoutFeedback
                  onPress={() => setImageModalVisible(false)}
                >
                  <View
                    style={{
                      display: "flex",
                      padding: 16,
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito-Regular",
                        fontSize: 16,
                        color: "#F5F6FBCA",
                      }}
                    >
                      Tekan area kosong untuk keluar
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  )
}

export default ImageModal
