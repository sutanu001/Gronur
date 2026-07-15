// src/screens/ProductDetailScreen.js
import React, { useRef, useState, useContext } from 'react';
import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayButton, ClayCard } from '../components/ClayPrimitives';
import { useBouncePress } from '../animations/useClayAnimations';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageScale = scrollY.interpolate({ inputRange: [-100, 0, 100], outputRange: [1.2, 1, 0.9], extrapolate: 'clamp' });
  const qtyBounce = useBouncePress(0.85);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <Animated.View style={{ height: 320, alignItems: 'center', justifyContent: 'center', transform: [{ scale: imageScale }] }}>
        <View style={{
          width: 220, height: 220, borderRadius: 110, backgroundColor: ClayColors.primaryLight,
          shadowColor: ClayColors.primary, shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.2, shadowRadius: 30, alignItems: 'center', justifyContent: 'center',
        }}>
          {product.image ? (
            <Image source={product.image} style={{ width: 160, height: 160, resizeMode: 'contain' }} />
          ) : (
            <View style={{
              width: 140, height: 140, borderRadius: 70, backgroundColor: ClayColors.primary,
              shadowColor: '#D4A72C', shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25, shadowRadius: 16,
            }} />
          )}
        </View>
      </Animated.View>

      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={[{
          position: 'absolute', top: 60, left: 24, width: 44, height: 44,
          borderRadius: ClayRadius.md, backgroundColor: ClayColors.surface,
          alignItems: 'center', justifyContent: 'center',
        }, ClayShadows.float]}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </View>
      </TouchableWithoutFeedback>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16} showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={[{
          borderTopLeftRadius: ClayRadius.xxl, borderTopRightRadius: ClayRadius.xxl,
          backgroundColor: ClayColors.surface, padding: 32, minHeight: 500,
        }, ClayShadows.float]}>
          <View style={{ width: 40, height: 5, backgroundColor: ClayColors.textMuted, borderRadius: 3, alignSelf: 'center', marginBottom: 24, opacity: 0.3 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5 }}>{product.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, marginTop: 4 }}>{product.unit}</Text>
            </View>
            <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.primary }}>${product.price}</Text>
          </View>

          <ClayCard padding={16} style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary }}>Quantity</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Animated.View style={{ transform: [{ scale: qtyBounce.scale }] }}>
                <TouchableWithoutFeedback onPressIn={qtyBounce.pressIn} onPressOut={qtyBounce.pressOut} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                  <View style={{ width: 40, height: 40, borderRadius: ClayRadius.sm, backgroundColor: ClayColors.bgPrimary, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.8)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>−</Text>
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.textPrimary, width: 30, textAlign: 'center' }}>{quantity}</Text>
              <Animated.View style={{ transform: [{ scale: qtyBounce.scale }] }}>
                <TouchableWithoutFeedback onPressIn={qtyBounce.pressIn} onPressOut={qtyBounce.pressOut} onPress={() => setQuantity(quantity + 1)}>
                  <View style={{ width: 40, height: 40, borderRadius: ClayRadius.sm, backgroundColor: ClayColors.primary, alignItems: 'center', justifyContent: 'center', ...ClayShadows.button, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.5)' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textOnPrimary }}>+</Text>
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          </ClayCard>

          <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 8 }}>Description</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, lineHeight: 24, marginBottom: 24 }}>
            Hand-picked daily from local organic farms. These premium quality fruits bring nature's sweetness straight to your kitchen with zero compromises on freshness.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 12 }}>Reviews ⭐ 4.8</Text>
          <ClayCard padding={16} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ClayColors.bgSecondary, marginRight: 12 }} />
              <View>
                <Text style={{ fontWeight: '700', color: ClayColors.textPrimary }}>Sarah Jenkins</Text>
                <Text style={{ fontSize: 12, color: ClayColors.textMuted }}>2 days ago</Text>
              </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, lineHeight: 24 }}>Absolutely love the quality! The packaging is eco-friendly too. 🌱</Text>
          </ClayCard>

          <ClayButton 
            title={`Add to Cart — $${(parseFloat(product.price) * quantity).toFixed(2)}`} 
            onPress={() => {
              addToCart(product, quantity);
              navigation.navigate('Cart');
            }} 
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
