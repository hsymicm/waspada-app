import { View, Text, StyleSheet } from "react-native"
import { Colors } from "../themes/Colors"
import { ExclamationTriangleIcon as ErrorIcon } from "react-native-heroicons/solid"

export function AuthNotification({ message, isError = false, style = null }) {
  return (
    <View
      style={[
        styles.container,
        isError ? styles.containerError : styles.containerInfo,
        style,
      ]}
    >
      <Text style={[styles.text, isError ? styles.textError : styles.textInfo]}>
        {message}
      </Text>
      {isError && <ErrorIcon size={18} color={Colors.error.color} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  containerError: {
    backgroundColor: Colors.error.light,
    borderColor: Colors.error.color,
  },
  containerInfo: {
    backgroundColor: Colors.info.light,
    borderColor: Colors.info.color,
  },
  text: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
  },
  textError: {
    color: Colors.error.color,
  },
  textInfo: {
    color: Colors.info.color,
  },
})
