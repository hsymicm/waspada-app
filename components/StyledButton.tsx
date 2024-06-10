import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { Colors } from "../themes/Colors"
import { useState } from "react"

interface StyledButtonProps {
  title: string,
  variant?: "primary" | "secondary",
  size?: "small" | "normal",
  iconLeft?: any,
  iconRight?: any,
  style?: object,
  textStyle?: object,
  disabled?: boolean,
  loading?: boolean,
  activeOpacity?: any,
  onPress?: () => void,
  onLongPress?: () => void,
}

export default function StyledButton({
  onPress,
  onLongPress,
  title,
  iconLeft,
  iconRight,
  style,
  textStyle,
  disabled,
  activeOpacity = 0.7,
  loading,
  variant = "primary",
  size = "normal",
}: StyledButtonProps) {
  const [isLoading, setLoading] = useState(false);

  const handleOnPressLoading = async () => {
    setLoading(true)
    await onPress();
    setLoading(false)
  }

  return (
    <TouchableOpacity
      onPress={loading ? handleOnPressLoading : onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={[
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        size === "normal" ? styles.sizeNormal : styles.sizeSmall,
        disabled && { backgroundColor: Colors.disabled.light },
        styles.button,
        style,
      ]}
    >
      {iconLeft}
      {isLoading && loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text
          style={[
            variant === "primary" ? styles.primaryText : styles.secondaryText,
            disabled && { color: Colors.disabled.dark },
            styles.text,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {iconRight}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primaryDark,
  },
  disabledButton: {
    backgroundColor: "#ABAEBA",
    color: "#3D3F48",
  },
  sizeNormal: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sizeSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
