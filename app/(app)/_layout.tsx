import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Header from "../../components/Header"
import ContentFilter from "../../components/ContentFilter"
import CustomDrawer from "../../components/CustomDrawer"

export default function AppLayout() {
  const [notFirstTime, setNotFirstTime] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkFirstLogin = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem("not_first_time"))
      return value ? value : null
    } catch (error) {
      console.log(error)
      return null
    }
  }

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
        initialRouteName="index"
        screenOptions={{
          drawerPosition: "right",
        }}
        drawerContent={({ navigation }) => (
          <CustomDrawer navigation={navigation} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            header: ({ navigation }) => (
              <Header
                title="Beranda"
                navigation={navigation}
                searchBarShown
              >
                <ContentFilter />
              </Header>
            ),
          }}
        />
        <Drawer.Screen
          name="detail/[id]"
          options={{
            unmountOnBlur: true,
            header: ({ navigation }) => (
              <Header title="Detail" navigation={navigation} />
            ),
          }}
        />
        <Drawer.Screen
          name="(auth)"
          options={{
            headerShown: false,
            // header: ({ navigation }) => (
            //   <Header title="Detail" navigation={navigation} />
            // ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
