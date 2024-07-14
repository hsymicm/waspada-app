import StyledButton from "../components/StyledButton"
import TextInputField from "../components/TextInputField"
import { AuthNotification } from "../components/AuthNotification"

import { StyleSheet, Text, ScrollView, View, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useNavigation } from "expo-router"
import { Colors } from "../themes/Colors"
import { useState, useRef } from "react"
import { handleAuthErrorMessage } from "../libs/utils"

import { useAuth } from "../contexts/AuthContext"
import { getDoc, doc, writeBatch, serverTimestamp } from "firebase/firestore"

import { FIREBASE_DB as db } from "../firebase.config"
import { StackActions } from "@react-navigation/native"

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [status, setStatus] = useState({
    isError: false,
    message: "",
  })

  const navigation = useNavigation()
  const _scrollView = useRef()
  const { userSignUp, userSignOut } = useAuth()

  const handleSignInRedirect = () => {
    router.push("/signin")
  }

  const handleSignUp = async () => {
    setStatus({ isError: true, message: "" })

    if (!username) {
      setStatus({ isError: true, message: "Username is empty" })
      return
    }

    if (!email) {
      setStatus({ isError: true, message: "Email is empty" })
      return
    }

    if (!password) {
      setStatus({ isError: true, message: "Credential is empty" })
      return
    }

    if (password !== confirmPassword) {
      setStatus({ isError: true, message: "Credential doesn't match" })
      return
    }

    try {
      setFormLoading(true)

      const usernameCheckRef = doc(db, "usernames", username)
      const usernameDoc = await getDoc(usernameCheckRef)

      if (usernameDoc.exists()) {
        setStatus({ isError: true, message: "Username is not available" })
        setFormLoading(false)
        return
      }

      const { user } = await userSignUp(email, password)

      const createdAt = serverTimestamp()
      const updatedAt = createdAt

      const userId = user.uid
      const batch = writeBatch(db)
      const usernameRef = doc(db, "usernames", username)
      const userRef = doc(db, "users", userId)

      batch.set(userRef, {
        username,
        displayName: username,
        description: "",
        email,
        profilePicture: null,
        createdAt,
        updatedAt,
      })
      batch.set(usernameRef, { uid: userId })

      await batch.commit()

      if (user) userSignOut()

      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop())
      }
      const path: any = "/signin?_signup=true"
      router.replace(path)
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "signin", params: { "_signup": "true" }}],

      // })
    } catch (e) {
      setStatus({ isError: true, message: handleAuthErrorMessage(e?.code) })
      console.log(e)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        ref={_scrollView}
        keyboardShouldPersistTaps="handled"
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
              Silahkan daftar untuk membuat akun Anda
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
            <Text style={styles.inputLabel}>Username</Text>
            <TextInputField
              value={username}
              setValue={(val) => {
                setUsername(val.replace(/\s/g, ""))
              }}
              autoCapitalize="none"
              type="default"
              placeholder="Masukkan username"
            />
          </View>
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
              setValue={(val) => {
                setPassword(val.replace(/\s/g, ""))
              }}
              autoCapitalize="none"
              type="default"
              password
              placeholder="Masukkan password"
            />
            <Text style={{ fontFamily: "Nunito-Regular", fontSize: 14 }}>
              Password harus mengandung minimal enam karakter, termasuk minimal
              1 huruf dan 1 angka.
            </Text>
          </View>
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={styles.inputLabel}>Konfirmasi Password</Text>
            <TextInputField
              value={confirmPassword}
              setValue={(val) => {
                setConfirmPassword(val.replace(/\s/g, ""))
              }}
              autoCapitalize="none"
              type="default"
              password
              placeholder="Masukkan ulang password"
            />
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
              title="Daftar"
              onPress={handleSignUp}
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
