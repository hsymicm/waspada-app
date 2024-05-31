import StyledIconButton from "./StyledIconButton"
import SearchFilter from "./SearchFilter"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "../themes/Colors"
import { useNavigation } from "@react-navigation/native"
import {
  ArrowLeftIcon as Arrow,
  Bars3Icon as Hamburger,
} from "react-native-heroicons/solid"
import { Shadow } from "react-native-shadow-2"

interface HeaderProps {
  children?: any
  title: string
  navigation: any
  titleShown?: boolean
  searchBarShown?: boolean
  extraBarShown?: boolean
  backButtonShown?: boolean
  value?: string
  setValue?: any
}

export default function Header({
  children,
  title,
  navigation,
  titleShown = true,
  searchBarShown = false,
  extraBarShown = false,
  backButtonShown = true,
  value,
  setValue,
}: HeaderProps) {
  const navigator = useNavigation()

  return (
    <SafeAreaView>
      <Shadow
        style={{ width: "100%" }}
        offset={[0, 2]}
        distance={8}
        startColor={Colors.shadow}
      >
        <ScrollView>
          <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
              {backButtonShown && !searchBarShown && (
                <StyledIconButton onPress={() => navigator.goBack()} variant="secondary" width={46}>
                  <Arrow color={Colors.primaryDark} />
                </StyledIconButton>
              )}
              {searchBarShown && (
                <SearchFilter
                  value={value}
                  setValue={setValue}
                  placeholder="Cari lokasi"
                />
              )}
              {titleShown && !searchBarShown && (
                <Text style={styles.title}>{title}</Text>
              )}
              <StyledIconButton onPress={() => navigation.openDrawer()} width={46}>
                <Hamburger color={Colors.white} />
              </StyledIconButton>
            </View>
            {children}
          </View>
        </ScrollView>
      </Shadow>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  columnContainer: {
    display: "flex",
    // gap: 16,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
  },
})
