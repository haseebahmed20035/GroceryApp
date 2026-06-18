import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const teal = "#0b8b8f";

const categories = [
  { id: 1, name: "Personal Care", image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png" },
  { id: 2, name: "Grocery", image: "https://cdn-icons-png.flaticon.com/512/3082/3082031.png" },
  { id: 3, name: "Cleaning Supplies", image: "https://cdn-icons-png.flaticon.com/512/995/995053.png" },
  { id: 4, name: "Beverages", image: "https://cdn-icons-png.flaticon.com/512/2405/2405479.png" },
  { id: 5, name: "Bakery", image: "https://cdn-icons-png.flaticon.com/512/3081/3081967.png" },
  { id: 6, name: "Baby Care", image: "https://cdn-icons-png.flaticon.com/512/3194/3194591.png" },
  { id: 7, name: "Snacks", image: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png" },
  { id: 8, name: "Desi Pack", image: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
];

const products = [
  {
    id: 1,
    name: "Cheeni DC Rate",
    category: "Grocery",
    price: 150,
    oldPrice: 170,
    off: 20,
    image: "https://pngimg.com/uploads/sugar/sugar_PNG50.png",
    promotion: true,
    special: false,
    trending: true,
  },
  {
    id: 2,
    name: "Dalda Oil 5ltr",
    category: "Grocery",
    price: 2950,
    oldPrice: 3025,
    off: 75,
    image: "https://www.pngmart.com/files/22/Cooking-Oil-PNG.png",
    promotion: true,
    special: false,
    trending: false,
  },
  {
    id: 3,
    name: "Egg 1 Dozen",
    category: "Grocery",
    price: 200,
    oldPrice: null,
    off: null,
    image: "https://pngimg.com/uploads/egg/egg_PNG97970.png",
    promotion: true,
    special: false,
    trending: true,
  },
  {
    id: 4,
    name: "Biryani Masala Alharram Special",
    category: "Desi Pack",
    price: 130,
    oldPrice: 150,
    off: 20,
    image: "https://pngimg.com/uploads/spices/spices_PNG38.png",
    promotion: false,
    special: true,
    trending: false,
  },
  {
    id: 5,
    name: "Al Harram Spaghetti",
    category: "Grocery",
    price: 199,
    oldPrice: 240,
    off: 41,
    image: "https://pngimg.com/uploads/spaghetti/spaghetti_PNG48.png",
    promotion: false,
    special: true,
    trending: false,
  },
  {
    id: 6,
    name: "Surf Excel Pouch 95gm",
    category: "Cleaning Supplies",
    price: 50,
    oldPrice: null,
    off: null,
    image: "https://pngimg.com/uploads/washing_powder/washing_powder_PNG28.png",
    promotion: false,
    special: false,
    trending: true,
  },
];

function ProductCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        {item.off && (
          <View style={styles.offBadge}>
            <Text style={styles.offText}>- Rs. {item.off} OFF</Text>
          </View>
        )}

        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs. {item.price}</Text>
          {item.oldPrice && <Text style={styles.oldPrice}>Rs. {item.oldPrice}</Text>}
        </View>
        <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
      </View>
    </View>
  );
}

function ProductSection({ title, data, viewText }) {
  if (!data.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />

      {viewText && (
        <TouchableOpacity>
          <Text style={styles.viewAll}>{viewText}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.line} />
    </View>
  );
}

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.header}>
          <Text style={styles.appName}>GroceryApp</Text>
          <Ionicons name="cart-outline" size={28} color="#111" />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={22} color="#555" />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor="#777"
              style={styles.searchInput}
            />
          </View>
          <Feather name="maximize" size={24} color="#333" />
        </View>

        <Image
          source={{
            uri: "https://png.pngtree.com/png-vector/20240204/ourmid/pngtree-grocery-products-on-pallet-png-image_11609185.png",
          }}
          style={styles.banner}
          resizeMode="contain"
        />

        <Text style={styles.bannerText}>Whole Sale Is Live Now</Text>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ViewAllCategories", { categories })}>
            <Text style={styles.viewCategories}>View All Categories</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("CategoryScreen", {
                  category: cat.name,
                  products: products.filter((p) => p.category === cat.name),
                })
              }
            >
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ProductSection
          title="ALHARRAM SPECIAL"
          data={products.filter((p) => p.special)}
          viewText="View All ALHARRAM SPECIAL Offers"
        />

        <ProductSection
          title="Promotion"
          data={products.filter((p) => p.promotion)}
          viewText="View All Promotion Offers"
        />

        <ProductSection
          title="Trending Products"
          data={products.filter((p) => p.trending)}
        />
      </ScrollView>

      <View style={styles.bottomTabs}>
        <Tab icon="basket-outline" title="Grocery" active />
        <Tab icon="reader-outline" title="Orders" />
        <Tab icon="cart-outline" title="Cart" />
        <Tab icon="person-outline" title="Account" />
      </View>
    </View>
  );
}

function Tab({ icon, title, active }) {
  return (
    <TouchableOpacity style={styles.tab}>
      <Ionicons name={icon} size={25} color={active ? "#111" : "#aaa"} />
      <Text style={[styles.tabText, active && { color: "#111" }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 15,
  },

  searchBox: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111",
  },

  banner: {
    height: 200,
    width: "100%",
    marginTop: 10,
  },

  bannerText: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: "#ddd",
  },

  activeDot: {
    width: 26,
    height: 9,
    borderRadius: 10,
    backgroundColor: teal,
  },

  categoryHeader: {
    marginTop: 28,
    paddingHorizontal: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 14,
  },

  viewCategories: {
    color: teal,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },

  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },

  categoryImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  categoryText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginTop: 6,
  },

  section: {
    marginTop: 18,
  },

  card: {
    width: 135,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  imageBox: {
    height: 130,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  productImage: {
    width: 100,
    height: 95,
  },

  offBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#45b957",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 2,
  },

  offText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  addBtn: {
    position: "absolute",
    right: -2,
    bottom: -12,
    backgroundColor: "#42c3c9",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  addText: {
    color: "#fff",
    fontSize: 30,
    marginTop: -3,
  },

  cardBody: {
    backgroundColor: "#eef9fb",
    padding: 10,
    minHeight: 92,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0aa4b4",
  },

  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginTop: 6,
  },

  viewAll: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 16,
    color: teal,
    fontWeight: "700",
  },

  line: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 18,
  },

  bottomTabs: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#f4fbfd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  tab: {
    alignItems: "center",
  },

  tabText: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
});