import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native"
import StyledIconButton from "../StyledIconButton"
import { ArrowLeftIcon } from "react-native-heroicons/solid"
import { Colors } from "../../themes/Colors"
import { Image as ExpoImage } from "expo-image"

const ImageModal = ({ visible, setVisible, url }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(!visible)}
    >
      <SafeAreaView
        style={{
          position: "absolute",
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <StyledIconButton
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: Colors.primary,
            borderRadius: 16,
          }}
          width={46}
          onPress={() => setVisible(!visible)}
        >
          <ArrowLeftIcon color={Colors.secondary} />
        </StyledIconButton>
      </SafeAreaView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.white,
        }}
      >
        <View style={{ position: "relative", width: "100%", elevation: 1 }}>
          {url ? (
            <ExpoImage
              style={{
                width: "100%",
                height: "100%",
              }}
              contentFit="contain"
              source={url}
            />
          ) : (
            <ActivityIndicator size="large" color={Colors.white} />
          )}
        </View>
      </View>
    </Modal>
  )
}

export default ImageModal
