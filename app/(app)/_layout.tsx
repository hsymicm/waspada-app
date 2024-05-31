import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import Header from "../../components/Header"
import ContentFilter from "../../components/ContentFilter"
import CustomDrawer from "../../components/CustomDrawer"

const checkFirstLogin = async () => {
  try {
    const value = JSON.parse(await AsyncStorage.getItem("not_first_time"))
    return value ? value : null
  } catch (error) {
    console.log(error)
    return null
  }
}

export default function AppLayout() {
  const [notFirstTime, setNotFirstTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkFirstLogin()
      setNotFirstTime(result)
      setLoading(false)
    }
    checkStatus()
  }, [])

  if (loading) return null

  if (!notFirstTime) return <Redirect href="/signin" />

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerPosition: "right",
        }}
        drawerContent={({ navigation }, props: any) => (
          <CustomDrawer navigation={navigation} {...props} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            header: ({ navigation }) => (
              <Header
                title="Beranda"
                value={search}
                navigation={navigation}
                setValue={setSearch}
                searchBarShown
              >
                <ContentFilter />
              </Header>
            ),
          }}
          initialParams={{ search }}
        />
        <Drawer.Screen
          name="(auth)/addpost"
          options={{
            header: ({ navigation }) => (
              <Header
                title="Lapor Kecelakaan"
                navigation={navigation}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
