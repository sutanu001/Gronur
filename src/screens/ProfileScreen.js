// src/screens/ProfileScreen.js
import React, { useContext } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayCard, ClayButton } from '../components/ClayPrimitives';
import { AuthContext } from '../context/AuthContext';
import { useSlideUp, usePulse } from '../animations/useClayAnimations';

const ClayAvatar = () => {
  const pulse = usePulse();
  return (
    <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <Animated.View style={{
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: ClayColors.accentPurple,
        shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 10,
        alignItems: 'center', justifyContent: 'center',
        borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.6)',
        transform: [{ scale: pulse }],
      }}>
        <Text style={{ fontSize: 50 }}>🥦</Text>
      </Animated.View>
    </View>
  );
};

export default function ProfileScreen() {
  const { user, orders, logout } = useContext(AuthContext);
  const { translateY, opacity } = useSlideUp(100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 140 }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5, marginBottom: 24 }}>Profile</Text>

        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 24 }}>
          <ClayAvatar />
          <Text style={{ fontSize: 26, fontWeight: '800', color: ClayColors.textPrimary }}>{user?.name || 'User Profile'}</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: ClayColors.textSecondary, marginTop: 4 }}>{user?.email || 'email@example.com'}</Text>
        </View>

        <Animated.View style={[{ transform: [{ translateY }], opacity }]}>
          <ClayCard padding={24} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 16 }}>📊 Shopper Statistics</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1, padding: 16, borderRadius: ClayRadius.md, backgroundColor: ClayColors.bgPrimary, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.textPrimary }}>{orders.length}</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: ClayColors.textSecondary, marginTop: 4, textAlign: 'center' }}>TOTAL ORDERS</Text>
              </View>
              <View style={{ flex: 1, padding: 16, borderRadius: ClayRadius.md, backgroundColor: ClayColors.primaryLight, alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.textPrimary }}>Premium</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: ClayColors.textSecondary, marginTop: 4, textAlign: 'center' }}>MEMBERSHIP</Text>
              </View>
            </View>
          </ClayCard>

          <ClayCard padding={24} style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 16 }}>⚙️ Settings</Text>
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: ClayColors.textPrimary }}>🔔 Push Notifications</Text>
                <Text style={{ fontSize: 14, fontWeight: '800', color: ClayColors.accentMint }}>Enabled</Text>
              </View>
              <View style={{ height: 1, backgroundColor: ClayColors.bgSecondary }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: ClayColors.textPrimary }}>📍 Default Address</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary }}>Home 01</Text>
              </View>
            </View>
          </ClayCard>

          <ClayCard padding={12} style={{ backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', borderWidth: 1 }}>
            <ClayButton 
              title="Sign Out" 
              variant="secondary" 
              onPress={logout}
              style={{
                backgroundColor: '#FFE9E9',
                borderColor: '#FFC1C1',
                borderTopColor: 'rgba(255,255,255,0.7)',
                shadowColor: '#EF9A9A',
              }}
            />
          </ClayCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
