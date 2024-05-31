import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import StyledIconButton from "./StyledIconButton"
import { XMarkIcon as CloseIcon } from "react-native-heroicons/solid"
import { router } from "expo-router"
import { Colors } from "../themes/Colors"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuth } from "../contexts/AuthContext"

export default function CustomDrawer({navigation, ...props}) {
  const { currentUser, userSignOut } = useAuth()

  const handleSignOut = async () => {
    
    try {
      await AsyncStorage.multiRemove(["guest", "not_first_time"])
      navigation.reset({
        index: 0,
        routes: [{ name: "signin"}],
  
      })
      if (currentUser) await userSignOut()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Menu</Text>
        <StyledIconButton onPress={() => navigation.closeDrawer()} width={46}>
          <CloseIcon color={Colors.white} />
        </StyledIconButton>
      </View>
      <ScrollView contentContainerStyle={styles.drawerListContainer}>
        <TouchableOpacity onPress={() => router.navigate("/(app)")} style={[styles.drawerItemContainer, true && { backgroundColor: Colors.lightGray}]}>
          <Text style={[styles.drawerItemText, true && { color: Colors.accent }]}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/(app)/(auth)/addpost")} style={styles.drawerItemContainer}>
          <Text style={styles.drawerItemText}>Lapor Kecelakaan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItemContainer}>
          <Text style={styles.drawerItemText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={styles.drawerItemContainer}>
          <Text style={[styles.drawerItemText, { color: Colors.error.primary }]}>
            Keluar
          </Text>
        </TouchableOpacity>
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
