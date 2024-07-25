import { ScrollView, View, Text, Image, StyleSheet } from "react-native"
import { useState } from "react"
import { router, useNavigation } from "expo-router"
import { Colors } from "../themes/Colors"
import { handleAuthErrorMessage } from "../libs/utils"
import { AuthNotification } from "../components/AuthNotification"
import { useAuth } from "../contexts/AuthContext"

import TextInputField from "../components/TextInputField"
import StyledButton from "../components/StyledButton"
import { StackActions } from "@react-navigation/native"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [status, setStatus] = useState({
    isError: false,
    message: "",
  })

  const navigation = useNavigation()

  const { userResetPassword } = useAuth()

  const handleSignInRedirect = () => {
    router.push("/signin")
  }

  const handleResetPassword = async () => {
    setFormLoading(true)
    setStatus({ isError: true, message: "" })

    if (!email) {
      setStatus({ isError: true, message: "Invalid email" })
      setFormLoading(false)
      return
    }

    try {
      await userResetPassword(email)

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop())
      }

      const path: any = `/signin?_resetpassword=true&_email=${email}`
      router.replace(path)
    } catch (e) {
      setStatus({ isError: true, message: handleAuthErrorMessage(e?.code) })
    }

    setFormLoading(false)
  }

  return (
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
            Reset Password akun{" "}
            <Text style={styles.textHighlight}>Waspada</Text>
          </Text>
          <Text style={styles.text}>
            Silahkan lakukan request untuk melakukan password akun Anda
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
            type="email-address"
            autoCapitalize="none"
            placeholder="Masukkan alamat email"
          />
          <Text style={{ fontFamily: "Nunito-Regular", fontSize: 14 }}>
            Masukkan alamat email yang Anda pakai untuk mendaftar akun pada
            Waspada
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 16,
          }}
        >
          <StyledButton
            loading
            disabled={formLoading}
            style={{ width: "100%" }}
            title="Reset Password"
            onPress={handleResetPassword}
          />
          <Text style={{ fontFamily: "Nunito-Regular", fontSize: 16 }}>
            Sudah memiliki akun?{" "}
            <Text
              onPress={handleSignInRedirect}
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Masuk
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
