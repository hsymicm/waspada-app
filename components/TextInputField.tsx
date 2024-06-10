import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native"
import { Colors } from "../themes/Colors"

import { useState } from "react"
import { KeyboardTypeOptions } from "react-native"

interface TextInputFieldProps {
  type?: KeyboardTypeOptions
  textArea?: boolean
  placeholder?: string
  value?: string
  setValue?: (arg0: string) => void
  password?: boolean
  autoCapitalize?: boolean
  disabled?: boolean
  style?: object
}

export default function TextInputField({
  type,
  textArea,
  placeholder,
  value,
  setValue,
  password,
  style,
  disabled,
  autoCapitalize = true,
}: TextInputFieldProps) {
  const [isActive, setActive] = useState(false)
  return (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={password}
      multiline={textArea}
      autoCapitalize={autoCapitalize ? "sentences" : "none"}
      numberOfLines={textArea ? 4 : 1}
      textAlignVertical={textArea ? "top" : "auto"}
      style={[
        styles.input,
        (isActive && !disabled)  && { borderColor: Colors.accent },
        disabled && { backgroundColor: "#EAEBF0" },
        textArea && {
          paddingVertical: 14,
        },
        style,
      ]}
      value={value}
      onChangeText={setValue}
      keyboardType={type}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      readOnly={disabled}
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
