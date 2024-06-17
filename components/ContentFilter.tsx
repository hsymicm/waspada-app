import { ScrollView, View, StyleSheet } from "react-native"
import { Cog6ToothIcon as Cog } from "react-native-heroicons/solid"
import StyledButton from "./StyledButton"
import { Colors } from "../themes/Colors"
import { router, useLocalSearchParams } from "expo-router"

export default function ContentFilter({}) {
  const { _filter, _search } = useLocalSearchParams()

  const filters = [
    {
      id: 1,
      label: "Terdekat",
      value: "near",
    },
    {
      id: 2,
      label: "Populer",
      value: "popular",
    },
    {
      id: 3,
      label: "Semua",
      value: "all",
    },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <StyledButton
          title="Terdekat"
          onPress={() => router.setParams({ _filter: "near", _search: "" })}
          variant={
            (_filter === "near" || !_filter) && (_search === "" || !_search)
              ? "primary"
              : "secondary"
          }
          size="small"
        />
        <StyledButton
          title="Populer"
          onPress={() => router.setParams({ _filter: "popular" })}
          variant={_filter === "popular" ? "primary" : "secondary"}
          size="small"
        />
        <StyledButton
          title="Semua"
          onPress={() => router.setParams({ _filter: "all" })}
          variant={_filter === "all" ? "primary" : "secondary"}
          size="small"
        />
        <StyledButton
          title="Pilih lainnya"
          variant="secondary"
          size="small"
          iconLeft={<Cog size={16} color={Colors.primaryDark} />}
          style={{ paddingRight: 14, paddingLeft: 12, gap: 4 }}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})
