// src/screens/CheckoutScreen.js
import React, { useContext } from 'react';
import { View, Text, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayCard, ClayButton } from '../components/ClayPrimitives';
import { useSlideUp, useStaggeredEntrance, useBouncePress } from '../animations/useClayAnimations';
import { AuthContext } from '../context/AuthContext';

export default function CheckoutScreen({ navigation }) {
  const { cartItems, addToCart, removeFromCart, clearCart, addOrder } = useContext(AuthContext);
  const { translateY, opacity } = useSlideUp(100);
  const { getStyle } = useStaggeredEntrance(Math.max(1, cartItems.length + 2), 120);
  const qtyBounce = useBouncePress(0.85);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? 5.00 : 0.00;
  const total = subtotal + delivery;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      for (const item of cartItems) {
        await addOrder(item.name, item.price, item.qty, 'Pending', item.emoji);
      }
      clearCart();
      navigation.navigate('MapTracking');
    } catch (err) {
      console.warn("Failed to place order:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 140 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5, marginBottom: 24 }}>Checkout</Text>

        {cartItems.length === 0 ? (
          <Animated.View style={getStyle(0)}>
            <ClayCard padding={32} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🛒</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: ClayColors.textPrimary }}>Your Cart is Empty</Text>
              <Text style={{ fontSize: 14, color: ClayColors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
                Browse our fresh products catalogue and add some items to your cart!
              </Text>
              <View style={{ marginTop: 24, alignSelf: 'stretch' }}>
                <ClayButton title="Shop Products" onPress={() => navigation.navigate('Home')} />
              </View>
            </ClayCard>
          </Animated.View>
        ) : (
          <>
            <Animated.View style={[{ marginBottom: 20 }, getStyle(0)]}>
              <ClayCard padding={24}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary }}>📍 Delivery Address</Text>
                  <Text style={{ color: ClayColors.primary, fontWeight: '700' }}>Change</Text>
                </View>
                <Text style={{ fontWeight: '600', color: ClayColors.textPrimary, marginBottom: 4 }}>Home 01</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, lineHeight: 24 }}>123 Green Valley, Springfield, USA</Text>
              </ClayCard>
            </Animated.View>

            <Animated.View style={[{ marginBottom: 20 }, getStyle(1)]}>
              <ClayCard padding={24}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 16 }}>💳 Payment</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 48, height: 32, borderRadius: 6, backgroundColor: ClayColors.primary, marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>VISA</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: ClayColors.textPrimary }}>•••• •••• •••• 4242</Text>
                    <Text style={{ fontSize: 12, color: ClayColors.textMuted }}>Expires 12/26</Text>
                  </View>
                </View>
              </ClayCard>
            </Animated.View>

            <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 16 }}>Order Summary</Text>
            
            {cartItems.map((item, idx) => (
              <Animated.View key={item.id} style={[{ marginBottom: 12 }, getStyle(idx + 2)]}>
                <ClayCard padding={16}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{ width: 48, height: 48, borderRadius: ClayRadius.sm, backgroundColor: ClayColors.bgPrimary, marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: ClayColors.textPrimary, fontSize: 15 }} numberOfLines={1}>{item.name}</Text>
                        <Text style={{ fontSize: 13, color: ClayColors.textMuted, marginTop: 2 }}>${item.price.toFixed(2)} each</Text>
                      </View>
                    </View>

                    {/* Quantity controls */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 16 }}>
                      <Animated.View style={{ transform: [{ scale: qtyBounce.scale }] }}>
                        <TouchableWithoutFeedback onPressIn={qtyBounce.pressIn} onPressOut={qtyBounce.pressOut} onPress={() => removeFromCart(item.id, 1)}>
                          <View style={{ width: 30, height: 30, borderRadius: ClayRadius.sm - 4, backgroundColor: ClayColors.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>−</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </Animated.View>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: ClayColors.textPrimary, width: 20, textAlign: 'center' }}>{item.qty}</Text>
                      <Animated.View style={{ transform: [{ scale: qtyBounce.scale }] }}>
                        <TouchableWithoutFeedback onPressIn={qtyBounce.pressIn} onPressOut={qtyBounce.pressOut} onPress={() => addToCart(item, 1)}>
                          <View style={{ width: 30, height: 30, borderRadius: ClayRadius.sm - 4, backgroundColor: ClayColors.primary, alignItems: 'center', justifyContent: 'center', ...ClayShadows.button }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: ClayColors.textOnPrimary }}>+</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </Animated.View>
                    </View>

                    <Text style={{ fontWeight: '800', color: ClayColors.textPrimary, fontSize: 16 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </Text>
                  </View>
                </ClayCard>
              </Animated.View>
            ))}

            <ClayCard padding={24} style={{ marginTop: 8, marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary }}>Subtotal</Text>
                <Text style={{ fontWeight: '600', color: ClayColors.textPrimary }}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary }}>Delivery</Text>
                <Text style={{ fontWeight: '600', color: ClayColors.textPrimary }}>${delivery.toFixed(2)}</Text>
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: ClayColors.bgSecondary, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary }}>Total</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.primary }}>${total.toFixed(2)}</Text>
              </View>
            </ClayCard>

            <Animated.View style={{ transform: [{ translateY }], opacity }}>
              <ClayButton title="Place Order" onPress={handlePlaceOrder} />
            </Animated.View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
