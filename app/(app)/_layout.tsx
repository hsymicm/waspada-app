import { Redirect } from "expo-router"
import { useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Header from "../../components/Header"
import ContentFilter from "../../components/ContentFilter"
import CustomDrawer from "../../components/CustomDrawer"

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="index"
        screenOptions={{
          drawerPosition: "right",
        }}
        drawerContent={({ navigation }) => (
          <CustomDrawer navigation={navigation} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            header: ({ navigation }) => (
              <Header
                title="Beranda"
                navigation={navigation}
                searchBarShown
              >
                <ContentFilter />
              </Header>
            ),
          }}
        />
        <Drawer.Screen
          name="detail/[id]"
          options={{
            unmountOnBlur: true,
            header: ({ navigation }) => (
              <Header title="Detail" navigation={navigation} />
            ),
          }}
        />
        <Drawer.Screen
          name="(auth)"
          options={{
            headerShown: false,
            // header: ({ navigation }) => (
            //   <Header title="Detail" navigation={navigation} />
            // ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
