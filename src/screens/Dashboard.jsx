import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import ProductCard from '../components/ProductCard'
import { categories, products, bannerImage, teal } from '../data/storeData'
import { request } from '../api/api'
function ProductSection ({ title, data, viewText, navigation, screenType }) {
  if (!data.length) return null
  const [categories, setCategories] = useState([])
  const [specialProducts, setSpecialProducts] = useState([])
  const [promotionProducts, setPromotionProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [catRes, specialRes, promoRes, trendingRes] = await Promise.all([
        request('/categories'),
        request('/products/special-offers'),
        request('/products/promotions'),
        request('/products/trending')
      ])

      setCategories(catRes.data)
      setSpecialProducts(specialRes.data)
      setPromotionProducts(promoRes.data)
      setTrendingProducts(trendingRes.data)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />

      {!!viewText && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CategoryScreen', {
              category: title,
              products: data
            })
          }
        >
          <Text style={styles.viewAll}>{viewText}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.line} />
    </View>
  )
}

export default function Dashboard ({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>GroceryApp</Text>
          <Ionicons name='cart-outline' size={28} color='#111' />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name='search' size={22} color='#555' />
            <TextInput
              placeholder='Search products...'
              placeholderTextColor='#777'
              style={styles.searchInput}
            />
          </View>
          <Feather name='maximize' size={24} color='#333' />
        </View>

        <Image
          source={bannerImage}
          style={styles.banner}
          resizeMode='contain'
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewAllCategories')}
          >
            <Text style={styles.viewCategories}>View All Categories</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('CategoryScreen', {
                  categoryId: cat.id,
                  category: cat.name
                })
              }
            >
              <Image source={cat.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ProductSection
          title='ALHARRAM SPECIAL'
          data={specialProducts}
          viewText='View All ALHARRAM SPECIAL Offers'
          navigation={navigation}
        />

        <ProductSection
          title='Promotion'
          data={promotionProducts}
          viewText='View All Promotion Offers'
          navigation={navigation}
        />

        <ProductSection
          title='Trending Products'
          data={trendingProducts}
          navigation={navigation}
        />
      </ScrollView>

      <View style={styles.bottomTabs}>
        <Tab icon='basket-outline' title='Grocery' active />
        <Tab icon='reader-outline' title='Orders' />
        <Tab icon='cart-outline' title='Cart' />
        <Tab icon='person-outline' title='Account' />
      </View>
    </View>
  )
}

function Tab ({ icon, title, active }) {
  return (
    <TouchableOpacity style={styles.tab}>
      <Ionicons name={icon} size={25} color={active ? '#111' : '#aaa'} />
      <Text style={[styles.tabText, active && { color: '#111' }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111'
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 15
  },

  searchBox: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111'
  },

  banner: {
    height: 200,
    width: '100%',
    marginTop: 10
  },

  bannerText: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '700',
    color: '#111'
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: '#ddd'
  },

  activeDot: {
    width: 26,
    height: 9,
    borderRadius: 10,
    backgroundColor: teal
  },

  categoryHeader: {
    marginTop: 28,
    paddingHorizontal: 12
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 14
  },

  viewCategories: {
    color: teal,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12
  },

  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20
  },

  categoryImage: {
    width: 58,
    height: 58,
    resizeMode: 'contain'
  },

  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    marginTop: 6
  },

  section: {
    marginTop: 18
  },

  viewAll: {
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 16,
    color: teal,
    fontWeight: '700'
  },

  line: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 18
  },

  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#f4fbfd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },

  tab: {
    alignItems: 'center'
  },

  tabText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2
  }
})
