import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { request } from "../api/api";

export default function CategoryScreen({ route, navigation }) {
  const { category, categoryId, products: passedProducts = [] } = route.params || {};
  const [products, setProducts] = useState(passedProducts);

  useEffect(() => {
    if (categoryId) {
      loadProducts();
    }
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      const res = await request(`/products/category/${categoryId}`);
      setProducts(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <ProductCard item={item} grid />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products available in this category.</Text>
        }
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});
