// src/screens/HomeScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, FlatList, Animated, TouchableWithoutFeedback } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayCard, ClayBadge, ClayProductCard, ClayButton } from '../components/ClayPrimitives';
import { useBouncePress, useParallaxScroll } from '../animations/useClayAnimations';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Fast Food', 'Drinks'];
const PRODUCTS = [
  { id: '1', name: 'Fresh Orange', price: '14.75', unit: '1 kg', category: 'Fruits', image: require('../assets/orange.png') },
  { id: '2', name: 'Red Apple', price: '10.45', unit: '1 kg', category: 'Fruits', image: require('../assets/apple.png') },
  { id: '3', name: 'Strawberry', price: '12.30', unit: '500 g', category: 'Fruits', image: require('../assets/strawberry.png') },
  { id: '4', name: 'Watermelon', price: '11.25', unit: '1 pc', category: 'Fruits', image: require('../assets/watermelon.png') },
  { id: '5', name: 'Dragon Fruit', price: '16.80', unit: '1 pc', category: 'Fruits', image: require('../assets/dragonfruit.png') },
  { id: '6', name: 'Capsicum', price: '8.50', unit: '500 g', category: 'Vegetables', image: require('../assets/capsicum.png') },
];

export default function HomeScreen({ navigation }) {
  const { cartItems } = useContext(AuthContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const { scrollY, headerTranslate } = useParallaxScroll();
  const cartBounce = useBouncePress(0.85);
  const totalCartQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const filtered = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <Animated.View style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
        paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
        backgroundColor: ClayColors.bgPrimary,
        transform: [{ translateY: headerTranslate }],
        shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 5,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: ClayColors.textMuted, letterSpacing: 0.3 }}>Good Morning 👋</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: ClayColors.textPrimary, letterSpacing: -0.3 }}>Daily Grocery</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: cartBounce.scale }] }}>
            <TouchableWithoutFeedback onPressIn={cartBounce.pressIn} onPressOut={cartBounce.pressOut} onPress={() => navigation.navigate('Cart')}>
              <View style={[{ width: 48, height: 48, borderRadius: ClayRadius.md, backgroundColor: ClayColors.surface, alignItems: 'center', justifyContent: 'center' }, ClayShadows.float]}>
                <Text style={{ fontSize: 20 }}>🛍️</Text>
                 {totalCartQty > 0 && (
                  <View style={{
                    position: 'absolute', top: -4, right: -4,
                    backgroundColor: ClayColors.accentCoral, borderRadius: 10,
                    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
                    borderWidth: 2, borderColor: ClayColors.bgPrimary,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{totalCartQty}</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 140, paddingHorizontal: 20, paddingBottom: 140 }}
      >
        <ClayCard padding={16} style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textMuted }}>Search fresh lemon...</Text>
        </ClayCard>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <ClayBadge key={cat} label={cat} isActive={activeCategory === cat} onPress={() => setActiveCategory(cat)} />
          ))}
        </ScrollView>

        <ClayCard padding={24} style={{ marginBottom: 24, backgroundColor: ClayColors.primaryLight, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 6 }}>Summer Sale</Text>
              <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, lineHeight: 24 }}>Get 20% off on all fruits this week!</Text>
              <View style={{ marginTop: 16, alignSelf: 'flex-start' }}>
                <ClayButton title="Shop Now" onPress={() => {}} style={{ paddingVertical: 12, paddingHorizontal: 20 }} />
              </View>
            </View>
            <View style={{
              width: 90, height: 90, borderRadius: 45, backgroundColor: ClayColors.primary,
              shadowColor: '#D4A72C', shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3, shadowRadius: 12,
            }} />
          </View>
        </ClayCard>

        <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 16 }}>Popular Fruits</Text>
        <FlatList
          data={filtered} numColumns={2} scrollEnabled={false} keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <ClayProductCard product={item} index={index} onPress={() => navigation.navigate('ProductDetail', { product: item })} />
          )}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
