import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import {
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"
import { useEffect, useState } from "react"

interface SearchFilterProps {
  style?: object
  placeholder?: string
  value?: string
  setValue?: any
  onActive?: any
  onSubmit?: any
}

export default function SearchFilter({
  placeholder,
  value,
  setValue,
  onActive,
  onSubmit,
  style,
}: SearchFilterProps) {

  const onEnterSubmit = () => {
    onSubmit({ address: { label: value } })
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <TextInput
        placeholder={placeholder}
        style={[
          styles.input,
          style,
        ]}
        value={value}
        onChangeText={setValue}
        returnKeyType="search"
        onFocus={() => onActive(true)}
        onBlur={() => onActive(false)}
        autoCapitalize="none"
        selectionColor={Colors.accent}
        onSubmitEditing={onEnterSubmit}
      />
      <View
        style={{
          position: "absolute",
          top: 13,
          left: 15,
        }}
      >
        <SearchIcon size={20} color={Colors.accent} />
      </View>
      {value && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 13,
            right: 15,
          }}
          activeOpacity={0.7}
          onPress={() => {
            setValue("")
          }}
        >
          <XMarkIcon size={20} color={Colors.gray} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 44,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 16,
    backgroundColor: Colors.white,
    fontFamily: "Nunito-Regular",
    fontSize: 16,
  },
})
