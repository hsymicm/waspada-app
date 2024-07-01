import fuzzysort from "fuzzysort"
import { SearchHistoryItem } from "../models/searchHistoryModel"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { Colors } from "../themes/Colors"
import {
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
} from "react-native-heroicons/outline"

type SuggestionItemProps = {
  item: SearchHistoryItem
  getValue: (item: SearchHistoryItem) => void
  deleteHistory?: (uid: string) => void
  isHistory?: boolean
}

function SuggestionItem({
  item,
  getValue,
  deleteHistory,
  isHistory = false,
}: SuggestionItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.itemContainer}
      onPress={() => getValue(item)}
    >
      <View style={styles.textContainer}>
        {isHistory ? (
          <ClockIcon size={20} color={Colors.gray} />
        ) : (
          <MapPinIcon size={20} color={Colors.gray} />
        )}
        <Text numberOfLines={1} style={styles.itemText}>
          {item?.address?.label}
        </Text>
      </View>
      {isHistory && (
        <TouchableOpacity onPress={() => deleteHistory(item.uid)}>
          <XMarkIcon size={20} color={Colors.gray} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

export default function SuggestionList({
  suggestion,
  history,
  deleteHistory,
  searchValue,
  getValue,
}) {
  const filteredHistory = history
    ? searchValue && searchValue !== ""
      ? fuzzysort
          .go(searchValue, history, { key: "address.label" })
          .map((result) => result.obj)
      : history.slice(0, 3)
    : []

  if (filteredHistory.length > 0 || (suggestion && suggestion.length > 0)) {
    return (
      <View style={styles.listContainer}>
        {filteredHistory
          .slice(0, suggestion && suggestion.length > 0 ? 2 : 4)
          .map((item: SearchHistoryItem) => (
            <SuggestionItem
              key={item.uid}
              item={item}
              getValue={getValue}
              deleteHistory={deleteHistory}
              isHistory
            />
          ))}
        {suggestion &&
          suggestion.length > 0 &&
          suggestion
            .slice(0, 3)
            .map((item: SearchHistoryItem) => (
              <SuggestionItem key={item.id} item={item} getValue={getValue} />
            ))}
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  listContainer: {
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
  },

  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },

  itemText: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
    flex: 1,
  },
})
