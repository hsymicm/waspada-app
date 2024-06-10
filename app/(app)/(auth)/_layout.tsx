import { Redirect, Slot, Stack } from "expo-router"
import { useAuth } from "../../../contexts/AuthContext"
import Header from "../../../components/Header"

export default function AuthLayout() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Redirect href="/signin" />
  }

  return (
    <Stack>
      <Stack.Screen
        name="addpost"
        options={{
          header: ({ navigation }) => (
            <Header title="Lapor Kecelakaan" navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}
