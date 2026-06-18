import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getImageUrl } from '../api/api'

export default function ProductCard ({ item, grid = false }) {
  const { width } = useWindowDimensions()
  const gridWidth = (width - 44) / 2
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={[styles.card, grid && { width: gridWidth, marginRight: 10 }]}
    >
      <View style={styles.imageBox}>
        {!!item.off && (
          <View style={styles.offBadge}>
            <Text style={styles.offText}>- Rs. {item.off} OFF</Text>
          </View>
        )}

        <Image
          source={
            typeof item.image === 'number'
              ? item.image
              : { uri: getImageUrl(item.image) }
          }
          style={styles.productImage}
          resizeMode='contain'
        />

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs. {item.price}</Text>
          {!!item.oldPrice && (
            <Text style={styles.oldPrice}>Rs. {item.oldPrice}</Text>
          )}
        </View>

        <Text numberOfLines={2} style={styles.productName}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 135,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  imageBox: {
    height: 130,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: 105,
    height: 95
  },
  offBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#45b957',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 2
  },
  offText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  addBtn: {
    position: 'absolute',
    right: -2,
    bottom: -12,
    backgroundColor: '#42c3c9',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  addText: {
    color: '#fff',
    fontSize: 30,
    marginTop: -3
  },
  cardBody: {
    backgroundColor: '#eef9fb',
    padding: 10,
    minHeight: 92
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0aa4b4'
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through'
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginTop: 6
  }
})
