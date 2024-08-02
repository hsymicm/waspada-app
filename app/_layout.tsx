import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import * as SplashScreen from "expo-splash-screen"

import { AppLoader } from "../components/AppLoader"
import { AuthProvider } from "../contexts/AuthContext"
import { Camera } from "expo-camera"
import * as Location from "expo-location"
import * as ImagePicker from "expo-image-picker"
import "react-native-get-random-values"

export const unstable_settings = {
  initialRouteName: "signin",
}

export { ErrorBoundary } from "expo-router"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false)
  const [fontsLoaded, fontError] = useFonts({
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("../assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Light": require("../assets/fonts/Nunito-Light.ttf"),
  })

  useEffect(() => {
    const prepare = async () => {
      if (!fontsLoaded && fontError) return
      
      try {
        await Location.requestForegroundPermissionsAsync()
        await Camera.requestCameraPermissionsAsync()
        await ImagePicker.requestMediaLibraryPermissionsAsync()

        setAppReady(true)
      } catch (error) {
        console.error(error)
      } finally {
        await SplashScreen.hideAsync()
      }
    }

    prepare()
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && fontError) {
    return null
  }

  return (
    <>
      {isAppReady && (
        <AppLoader isLoaded={isAppReady}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="signin" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen
                name="resetpassword"
                options={{ headerShown: false }}
              />
            </Stack>
          </AuthProvider>
        </AppLoader>
      )}
    </>
  )
}
