import { TouchableOpacity, StyleSheet } from "react-native"
import { Colors } from "../themes/Colors"

interface StyledIconButtonProps {
  children: any
  onPress: () => void
  variant?: "primary" | "secondary"
  style?: object
  width?: number
}

export default function StyledIconButton({
  children,
  onPress,
  style,
  width,
  variant = "primary",
}: StyledIconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor:
            variant === "primary" ? Colors.primary : Colors.secondary,
        },
        width && { width },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 46,
    aspectRatio: 1/1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
  },
})
