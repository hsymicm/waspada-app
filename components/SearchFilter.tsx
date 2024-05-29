import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import {
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"
import { useState } from "react"

interface SearchFilterProps {
  style?: object
  placeholder?: string
  value: string
  setValue: (arg0: string) => void
}

export default function SearchFilter({
  value,
  setValue,
  placeholder,
  style,
}: SearchFilterProps) {
  const [isActive, setActive] = useState(false)
  return (
    <View style={{ position: "relative", flex: 1 }}>
        <TextInput
          placeholder={placeholder}
          style={[
            styles.input,
            isActive && { borderColor: Colors.accent },
            (value === "" || !value) && { paddingLeft: 44 },
            style,
          ]}
          value={value}
          onChangeText={setValue}
          returnKeyType="search"
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          selectionColor={Colors.accent}
        />
      <View
        style={[
          {
            position: "absolute",
            top: 13,
          },
          value === "" || !value ? { left: 15 } : { right: 14 },
        ]}
      >
        {value === "" || !value ? (
          <SearchIcon size={20} color={Colors.accent} />
        ) : (
          <TouchableOpacity onPress={() => setValue("")}>
            <XMarkIcon size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>
    </View>
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
