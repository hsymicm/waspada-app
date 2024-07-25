import AsyncStorage from "@react-native-async-storage/async-storage"
import { StackActions } from "@react-navigation/native"
import { Redirect, router, useNavigation } from "expo-router"
import { useEffect, useState } from "react"

export default function App() {
  const [notFirstTime, setNotFirstTime] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigation = useNavigation()

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

  navigation.reset({
    index: 0,
    routes: [{name: "(app)"}]
  })
  
  return null
}
