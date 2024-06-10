import { StyleSheet, Text, ScrollView, View, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import StyledButton from "../components/StyledButton"
import { router, useLocalSearchParams, useNavigation } from "expo-router"
import { Colors } from "../themes/Colors"
import { useEffect, useState } from "react"
import TextInputField from "../components/TextInputField"
import { useAuth } from "../contexts/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthNotification } from "../components/AuthNotification"
import { handleAuthErrorMessage } from "../libs/utils"
import { StackActions } from "@react-navigation/native"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [status, setStatus] = useState({
    isError: false,
    message: "",
  })

  const { userSignIn } = useAuth()
  const navigation = useNavigation()

  const handleSignUpRedirect = () => {
    router.push("/signup")
  }

  const { _signup, _resetpassword, _email } = useLocalSearchParams()

  const handleSignIn = async () => {
    setFormLoading(true)

    setStatus({
      isError: true,
      message: "",
    })

    if (!email) {
      setStatus({ isError: true, message: "Invalid email" })
      setFormLoading(false)
      return
    }

    if (!password) {
      setStatus({ isError: true, message: "Invalid credential" })
      setFormLoading(false)
      return
    }

    try {
      await userSignIn(email, password)
      await AsyncStorage.setItem("not_first_time", "true")

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop())
      }
      router.replace("/")
    } catch (e) {
      setStatus({ isError: true, message: handleAuthErrorMessage(e?.code) })
    }

    setFormLoading(false)
  }

  const handleGuestSignIn = async () => {
    setFormLoading(true)

    try {
      const tempUser = {
        username: "tempusername",
        email: "tempemail@example.com",
        id: "temp001",
      }
      await AsyncStorage.setItem("guest", JSON.stringify(tempUser))
      await AsyncStorage.setItem("not_first_time", "true")

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop())
      }
      router.replace("/")
    } catch (e) {
      setStatus({ isError: true, message: handleAuthErrorMessage() })
      // console.log(e)
    }

    setFormLoading(false)
  }

  useEffect(() => {
    if (_signup) {
      setStatus({
        isError: false,
        message: "Daftar akun berhasil, silahkan masuk",
      })
      return
    }

    if (_resetpassword) {
      setStatus({
        isError: false,
        message: "Reset password berhasil, cek email",
      })
      if (_email) {
        setEmail(_email)
      }
      return
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        style={{
          position: "relative",
          backgroundColor: Colors.white,
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              gap: 8,
              paddingBottom: 16,
            }}
          >
            <Text style={styles.title}>
              Selamat Datang di{" "}
              <Text style={styles.textHighlight}>Waspada</Text>
            </Text>
            <Text style={styles.text}>
              Silahkan masuk untuk melaporkan kecelakaan
            </Text>
          </View>
          {status?.message !== "" && (
            <AuthNotification
              message={status.message}
              isError={status.isError}
              style={{ marginBottom: 8 }}
            />
          )}
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={styles.inputLabel}>Alamat Email</Text>
            <TextInputField
              value={email}
              setValue={setEmail}
              autoCapitalize="none"
              type="email-address"
              placeholder="Masukkan email"
            />
          </View>
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInputField
              value={password}
              setValue={setPassword}
              autoCapitalize="none"
              type="default"
              password
              placeholder="Masukkan password"
            />
            <View style={{ display: "flex", alignItems: "flex-end" }}>
              <Text
                onPress={() => router.push("/resetpassword")}
                style={{ fontFamily: "Nunito-Regular" }}
              >
                Lupa password?
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 8,
                width: "100%",
              }}
            >
              <StyledButton
                title="Masuk"
                loading
                disabled={formLoading}
                onPress={handleSignIn}
              />
              <StyledButton
                title="Masuk sebagai tamu"
                variant="secondary"
                loading
                disabled={formLoading}
                onPress={handleGuestSignIn}
              />
            </View>
            <Text style={{ fontFamily: "Nunito-Regular", fontSize: 16 }}>
              Belum memiliki akun?{" "}
              <Text
                onPress={handleSignUpRedirect}
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Daftar
              </Text>
            </Text>
          </View>
        </View>
        <Image
          style={styles.background}
          source={require("../assets/waspada-bg-white.png")}
          fadeDuration={300}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 32,
    color: Colors.black,
    lineHeight: 38,
  },
  text: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
    width: "90%",
  },
  inputLabel: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
  },
  textHighlight: {
    color: Colors.accent,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 96,
    gap: 16,
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    zIndex: -1,
    left: 0,
    top: 0,
  },
})
