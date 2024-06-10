import { Stack } from "expo-router"
import Header from "../../../../components/Header"

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: ({ navigation }) => (
            <Header title="Profil" navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="editprofile"
        options={{
          header: ({ navigation }) => (
            <Header title="Edit Profil" navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="postarchive"
        options={{
          header: ({ navigation }) => (
            <Header title="Arsip Laporan" navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="posthistory"
        options={{
          header: ({ navigation }) => (
            <Header title="Riwayat Laporan" navigation={navigation} />
          ),
        }}
      />
    </Stack>
  )
}
