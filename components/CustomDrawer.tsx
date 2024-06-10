import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import StyledIconButton from "./StyledIconButton"
import { XMarkIcon as CloseIcon } from "react-native-heroicons/solid"
import { router, usePathname } from "expo-router"
import { Colors } from "../themes/Colors"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react"

function CustomDrawerItem({ label, name, path, currentRoute }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.navigate(path)}
      style={[
        styles.drawerItemContainer,
        currentRoute === name && { backgroundColor: Colors.lightGray },
      ]}
    >
      <Text
        style={[
          styles.drawerItemText,
          currentRoute === name && { color: Colors.accent },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default function CustomDrawer({ navigation }) {
  const { currentUser, userSignOut } = useAuth()
  const [currentRoute, setCurrentRoute] = useState(null)

  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(["guest", "not_first_time"])
      navigation.reset({
        index: 0,
        routes: [{ name: "signin" }],
      })
      if (currentUser) await userSignOut()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const route = pathname.split("/").pop()
    if (route === "") return setCurrentRoute("index")
    setCurrentRoute(route)
  }, [pathname])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Menu</Text>
        <StyledIconButton onPress={() => navigation.closeDrawer()} width={46}>
          <CloseIcon color={Colors.white} />
        </StyledIconButton>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.drawerListContainer}
      >
        <CustomDrawerItem
          label="Beranda"
          name="index"
          path="/(app)"
          currentRoute={currentRoute}
        />
        {currentUser ? (
          <>
            <CustomDrawerItem
              label="Lapor Kecelakaan"
              name="addpost"
              path="/(app)/(auth)/addpost"
              currentRoute={currentRoute}
            />
            <CustomDrawerItem
              label="Profil"
              name="profile"
              path="/(app)/(auth)/profile"
              currentRoute={currentRoute}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSignOut}
              style={styles.drawerItemContainer}
            >
              <Text
                style={[styles.drawerItemText, { color: Colors.error.color }]}
              >
                Keluar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate("/signin")}
              style={styles.drawerItemContainer}
            >
              <Text style={styles.drawerItemText}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate("/signup")}
              style={styles.drawerItemContainer}
            >
              <Text style={styles.drawerItemText}>Daftar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  drawerHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },

  drawerHeaderText: {
    fontFamily: "Nunito-Bold",
    fontSize: 20,
    color: Colors.black,
  },

  drawerListContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: "50%",
    height: "100%",
  },

  drawerItemContainer: {
    display: "flex",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    width: "100%",
  },

  drawerItemText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: Colors.black,
  },
})
