import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { request, getImageUrl } from '../api/api'

const teal = '#0b8b8f'

export default function ProductDetails ({ route, navigation }) {
  const { product } = route.params
  const [qty, setQty] = useState(1)

  const total = product.price * qty
const addToCart = async () => {
  try {
    await request("/cart/add", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        quantity: qty,
      }),
    });

    Alert.alert("Success", "Product added to cart");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name='arrow-back' size={24} color='#111' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn}>
            <Ionicons name='cart-outline' size={25} color='#111' />
          </TouchableOpacity>
        </View>

        <View style={styles.imageBox}>
          {!!product.off && (
            <View style={styles.offBadge}>
              <Text style={styles.offText}>Rs. {product.off} OFF</Text>
            </View>
          )}

          <Image
            source={
              typeof product.image === 'number'
                ? product.image
                : { uri: getImageUrl(product.image) }
            }
            style={styles.image}
            resizeMode='contain'
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs. {product.price}</Text>
            {!!product.oldPrice && (
              <Text style={styles.oldPrice}>Rs. {product.oldPrice}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Info icon='checkmark-circle-outline' title='In Stock' />
            <Info icon='cube-outline' title='Fresh Quality' />
            <Info icon='bicycle-outline' title='Fast Delivery' />
          </View>

          <View style={styles.qtyBox}>
            <Text style={styles.qtyTitle}>Quantity</Text>

            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => qty > 1 && setQty(qty - 1)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qty}>{qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(qty + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Product Details</Text>
            <Text style={styles.description}>
              {product.description ||
                `${product.name} is available in GroceryApp with good quality and best price. You can add this product to cart or buy it directly.`}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Additional Information</Text>

            <Row label='Brand' value={product.brand || 'GroceryApp'} />
            <Row label='Unit' value={product.unit || '1 item'} />
            <Row label='Category' value={product.category} />
            <Row label='Availability' value={product.stock || 'In Stock'} />
            <Row
              label='Delivery'
              value={product.delivery || 'Same day delivery'}
            />
            <Row label='Payment' value='Cash on Delivery' />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.total}>Rs. {total}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.addCart}
          onPress={addToCart}>
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function Info ({ icon, title }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={21} color={teal} />
      <Text style={styles.infoText}>{title}</Text>
    </View>
  )
}

function Row ({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbfc'
  },

  top: {
    paddingTop: 45,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  backBtn: {
    backgroundColor: '#fff',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },

  cartBtn: {
    backgroundColor: '#fff',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },

  imageBox: {
    height: 280,
    margin: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },

  image: {
    width: '80%',
    height: '80%'
  },

  offBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: '#45b957',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20
  },

  offText: {
    color: '#fff',
    fontWeight: '700'
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 110
  },

  category: {
    color: teal,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6
  },

  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111'
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12
  },

  price: {
    fontSize: 26,
    fontWeight: '900',
    color: teal
  },

  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through'
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22
  },

  infoItem: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2
  },

  infoText: {
    fontSize: 11,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '600'
  },

  qtyBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },

  qtyTitle: {
    fontSize: 18,
    fontWeight: '700'
  },

  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef9fb',
    borderRadius: 30,
    padding: 5
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: teal,
    justifyContent: 'center',
    alignItems: 'center'
  },

  qtyBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700'
  },

  qty: {
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 18
  },

  detailCard: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 2
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10
  },

  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },

  rowLabel: {
    color: '#777',
    fontSize: 14
  },

  rowValue: {
    color: '#111',
    fontSize: 14,
    fontWeight: '700'
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 14,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10
  },

  totalLabel: {
    color: '#777',
    fontSize: 12
  },

  total: {
    color: teal,
    fontSize: 21,
    fontWeight: '900'
  },

  actions: {
    flexDirection: 'row',
    gap: 10
  },

  addCart: {
    borderWidth: 1,
    borderColor: teal,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14
  },

  addCartText: {
    color: teal,
    fontWeight: '800'
  },

  buyNow: {
    backgroundColor: teal,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14
  },

  buyNowText: {
    color: '#fff',
    fontWeight: '800'
  }
})
