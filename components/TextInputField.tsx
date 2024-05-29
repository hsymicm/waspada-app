import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native"
import { Colors } from "../themes/Colors"
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid"

import { useState } from "react"
import { KeyboardTypeOptions } from "react-native"

interface TextInputFieldProps {
  type?: KeyboardTypeOptions
  placeholder?: string
  value?: string
  setValue?: (arg0: string) => void
  password?: boolean
  style?: object
}

export default function TextInputField({
  type,
  placeholder,
  value,
  setValue,
  password,
  style,
}: TextInputFieldProps) {
  const [isActive, setActive] = useState(false)
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={password}
      style={[
        styles.input,
        (isActive || value) && { borderColor: Colors.accent },
        isActive && {
          elevation: 8,
          shadowColor: "#7B7EFF",
        },
        style,
      ]}
      value={value}
      onChangeText={setValue}
      keyboardType={type}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      selectionColor={Colors.accent}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 16,
    backgroundColor: Colors.white,
    fontFamily: "Nunito-Regular",
    fontSize: 16,
  },
})
