import { View, Text, FlatList } from "react-native"
import { Colors } from "../../../../themes/Colors"
import FlatCard from "../../../../components/FlatCard"

export default function Profile() {
  const data = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345",
      location: "Boncang, Tanah Abang",
      date: "Mei 14, 2024 - 1:18 PM",
      description:
        "Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345",
      location: "Boncang, Tanah Abang",
      date: "Mei 14, 2024 - 1:18 PM",
      description:
        "Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1517586979036-b7d1e86b3345",
      location: "Boncang, Tanah Abang",
      date: "Mei 14, 2024 - 1:18 PM",
      description:
        "Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc",
    },
  ]

  return (
    <FlatList
      style={{
        backgroundColor: Colors.lightGray,
      }}
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
      data={data}
      renderItem={({ item }) => (
        <FlatCard
          id={1}
          image={item.image}
          date={item.date}
          location={item.location}
          description={item.description}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}
