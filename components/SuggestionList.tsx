import { TouchableOpacity, View, Text } from "react-native"
import { Colors } from "../themes/Colors"
import { MapPinIcon } from "react-native-heroicons/outline"

function SuggestionItem({ item, getValue }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
      }}
      onPress={() => getValue(item)}
    >
      <MapPinIcon size={20} color={Colors.gray} />
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Nunito-Regular",
          fontSize: 16,
          color: Colors.black,
          flex: 1,
        }}
      >
        {item?.address?.label}
      </Text>
    </TouchableOpacity>
  )
}

export default function SuggestionList({ suggestion, getValue }) {
  return (
    <View
      style={{
        top: "100%",
        left: 0,
        margin: 16,
        transform: [{ translateY: 8 }],
        paddingVertical: 8,
        width: "100%",
        position: "absolute",
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 16,
        backgroundColor: Colors.white,
        zIndex: 1,
      }}
    >
      {suggestion.map((item: any) => (
        <SuggestionItem key={item.id} item={item} getValue={getValue} />
      ))}
    </View>
  )
}
