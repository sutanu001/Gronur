// src/screens/OrdersScreen.js
import React, { useContext } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius } from '../theme/clayTheme';
import { ClayCard, ClayBadge } from '../components/ClayPrimitives';
import { useStaggeredEntrance } from '../animations/useClayAnimations';
import { AuthContext } from '../context/AuthContext';

const STATUS_COLORS = {
  'Delivered': ClayColors.accentMint,
  'Pending': ClayColors.accentCoral,
  'Processing': ClayColors.primary,
};

export default function OrdersScreen() {
  const { orders } = useContext(AuthContext);
  const { getStyle } = useStaggeredEntrance(Math.max(1, orders.length), 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 140 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5, marginBottom: 24 }}>My Orders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {['All Orders', 'Pending', 'Processing', 'Delivered'].map((tab, i) => (
            <ClayBadge key={tab} label={tab} isActive={i === 0} onPress={() => {}} />
          ))}
        </ScrollView>

        {orders.length === 0 ? (
          <Animated.View style={getStyle(0)}>
            <ClayCard padding={32} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 44, marginBottom: 16 }}>📋</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: ClayColors.textPrimary }}>No Orders Yet</Text>
              <Text style={{ fontSize: 14, color: ClayColors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
                You haven't placed any orders yet. Go check out the cart to make your first purchase!
              </Text>
            </ClayCard>
          </Animated.View>
        ) : (
          orders.map((order, index) => {
            const color = STATUS_COLORS[order.status] || ClayColors.primary;
            return (
              <Animated.View key={order.id || index.toString()} style={[{ marginBottom: 16 }, getStyle(index)]}>
                <ClayCard padding={24}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ width: 56, height: 56, borderRadius: ClayRadius.md, backgroundColor: ClayColors.bgPrimary, marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 24 }}>{order.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', fontSize: 16, color: ClayColors.textPrimary, marginBottom: 4 }}>{order.item}</Text>
                      <Text style={{ fontSize: 13, color: ClayColors.textMuted, fontWeight: '600' }}>{order.date}</Text>
                    </View>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: ClayColors.textPrimary }}>${order.price.toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: ClayRadius.full, backgroundColor: color + '20' }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: color }}>{order.status}</Text>
                    </View>
                    {order.status === 'Pending' && (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: ClayColors.primary }}>Track Order →</Text>
                    )}
                  </View>
                </ClayCard>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
