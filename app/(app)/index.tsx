import { useEffect, useState } from "react"
import { TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { useAuth } from "../../contexts/AuthContext"
import CurrentLocationFeed from "../../components/CurrentLocationFeed"
import { Shadow } from "react-native-shadow-2"
import { Colors } from "../../themes/Colors"
import { PlusIcon } from "react-native-heroicons/solid"
import AllFeed from "../../components/AllFeed"
import PopularFeed from "../../components/PopularFeed"

export default function HomeScreen() {
  const { _filter, _search }: any = useLocalSearchParams()
  const { currentUser } = useAuth()

  const renderFeed = () => {
    if (_filter === "near" || !_filter) {
      return <CurrentLocationFeed currentUser={currentUser} />
    }

    if (_filter === "popular") {
      return <PopularFeed currentUser={currentUser} />
    }

    if (_filter === "all") {
      return <AllFeed currentUser={currentUser} />
    }
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      {renderFeed()}
      {currentUser && (
        <TouchableOpacity
          onPress={() => router.navigate("/(auth)/addpost")}
          activeOpacity={1}
          style={{ position: "absolute", bottom: 48, right: 36 }}
        >
          <Shadow offset={[0, 2]} distance={4} startColor={Colors.shadow}>
            <View
              style={{
                backgroundColor: Colors.primary,
                padding: 16,
                borderRadius: 32,
              }}
            >
              <PlusIcon size={28} color={Colors.white} />
            </View>
          </Shadow>
        </TouchableOpacity>
      )}
    </View>
  )
}
