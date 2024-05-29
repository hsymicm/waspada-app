import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import Header from "../../components/Header"
import ContentFilter from "../../components/ContentFilter"

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
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            header: () => (
              <Header
                title="Header"
                value={search}
                setValue={setSearch}
                searchBarShown
                navigation={null}
              >
                <ContentFilter />
              </Header>
            ),
          }}
          initialParams={{ search }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
