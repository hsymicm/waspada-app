import {
  Pressable,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native"
import {
  ChevronRightIcon as Arrow,
  MapPinIcon as Pin,
} from "react-native-heroicons/solid"
import { Colors } from "../themes/Colors"
import { TouchableOpacity } from "react-native-gesture-handler"

interface FlatCard {
  description: string
  location: string
  date: string
  image: string
  id: string
}

export default function FlatCard({ description, date, location, image, id }) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri: image }}
        />
      </View>
      <View
        style={{
          flex: 3,
          padding: 16,
          gap: 8,
        }}
      >
        <View style={{ gap: 4 }}>
          <View style={styles.locationContainer}>
            <Pin color={Colors.accent} size={14} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.locationText}
            >
              {location}
            </Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
      {/* <TouchableOpacity>
        <View style={styles.button}>
          <Arrow size={16} color={Colors.white} />
        </View>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.white,
  },
  locationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 4,
  },
  locationText: {
    flex: 1,
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: Colors.accent,
    width: "100%",
  },
  date: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: Colors.black,
  },
  description: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.black,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 8,
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
})
