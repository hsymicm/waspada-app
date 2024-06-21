import StyledIconButton from "./StyledIconButton"
import SearchFilter from "./SearchFilter"
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "../themes/Colors"
import * as Location from "expo-location"
import {
  ArrowLeftIcon as Arrow,
  Bars3Icon as Hamburger,
} from "react-native-heroicons/solid"
import { Shadow } from "react-native-shadow-2"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { geoAutosuggest } from "../libs/geo"
import SuggestionList from "./SuggestionList"

interface HeaderProps {
  children?: any
  title: string
  navigation: any
  route?: any
  titleShown?: boolean
  canGoBack?: boolean
  searchBarShown?: boolean
  extraBarShown?: boolean
  backButtonShown?: boolean
}

export default function Header({
  children,
  title,
  navigation,
  canGoBack = true,
  titleShown = true,
  searchBarShown = false,
  backButtonShown = true,
}: HeaderProps) {
  const [value, setValue] = useState("")
  const [currentLocation, setCurrentLocation] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [isSuggesting, setSuggesting] = useState(false)

  const handleBackPress = () => {
    if (canGoBack) {
      navigation.goBack()
    } else {
      router.navigate("(app)")
    }
  }

  const fetchSuggestion = async (query: string, location: any) => {
    const { latitude, longitude } = location

    try {
      const result = await geoAutosuggest({ query, latitude, longitude })
      setSuggestion(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchSubmit = (search: any) => {
    try {
      router.setParams({
        _search: search?.id ? search.id : search.address.label,
        _filter: "near",
      })
      Keyboard.dismiss()
      setSuggestion(null)
      setValue("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (value === "") {
      setCurrentLocation(null)
      setSuggestion(null)
    }

    const getSuggestion = setTimeout(async () => {
      if (value && currentLocation === null) {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        const latitude = loc.coords.latitude
        const longitude = loc.coords.longitude

        fetchSuggestion(value, { latitude, longitude })
        setCurrentLocation({ latitude, longitude })
      }

      if (value && currentLocation) {
        fetchSuggestion(value, currentLocation)
      }
    }, 1000)

    return () => clearTimeout(getSuggestion)
  }, [value])

  return (
    <SafeAreaView>
      <Shadow
        style={{ width: "100%" }}
        offset={[0, 2]}
        distance={8}
        startColor={Colors.shadow}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.columnContainer}>
            <View style={styles.rowContainer}>
              {backButtonShown && !searchBarShown && (
                <StyledIconButton
                  onPress={handleBackPress}
                  variant="secondary"
                  width={46}
                >
                  <Arrow color={Colors.primaryDark} />
                </StyledIconButton>
              )}
              {searchBarShown && (
                <>
                  <SearchFilter
                    value={value}
                    setValue={setValue}
                    onSubmit={(val: any) => handleSearchSubmit(val)}
                    active={(val: boolean) => setSuggesting(val)}
                    placeholder="Cari lokasi"
                  />
                  {suggestion && value && isSuggesting && (
                    <SuggestionList
                      getValue={(val: any) => handleSearchSubmit(val)}
                      suggestion={suggestion?.items}
                    />
                  )}
                </>
              )}
              {titleShown && !searchBarShown && (
                <Text style={styles.title}>{title}</Text>
              )}
              {!isSuggesting && (
                <StyledIconButton
                  onPress={() => navigation.openDrawer()}
                  width={46}
                >
                  <Hamburger color={Colors.white} />
                </StyledIconButton>
              )}
            </View>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </Shadow>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  columnContainer: {
    display: "flex",
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
