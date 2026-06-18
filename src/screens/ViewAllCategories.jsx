import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { categories, products } from "../data/storeData";

export default function ViewAllCategories({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>All Categories</Text>
      </View>

      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("CategoryScreen", {
                category: item.name,
                products: products.filter((p) => p.category === item.name),
              })
            }
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 45,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  item: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 25,
  },
  image: { width: 70, height: 70, resizeMode: "contain" },
  name: { marginTop: 8, textAlign: "center", fontSize: 13, color: "#333" },
});
