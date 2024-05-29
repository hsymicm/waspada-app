import { ScrollView, View, StyleSheet } from "react-native"
import { Cog6ToothIcon as Cog } from "react-native-heroicons/solid"
import StyledButton from "./StyledButton"
import { Colors } from "../themes/Colors"

export default function ContentFilter({}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <StyledButton title="Terdekat" variant="primary" size="small" />
        <StyledButton title="Popular" variant="secondary" size="small" />
        <StyledButton title="Semua" variant="secondary" size="small" />
        <StyledButton
          title="Pilih lainnya"
          variant="secondary"
          size="small"
          iconLeft={
            <Cog size={18} color={Colors.primaryDark} />
          }
          style={{ paddingHorizontal: 14 }}
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
