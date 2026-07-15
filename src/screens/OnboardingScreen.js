// src/screens/OnboardingScreen.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius } from '../theme/clayTheme';
import { ClayButton } from '../components/ClayPrimitives';
import { useSlideUp, usePulse } from '../animations/useClayAnimations';

const ClayIllustration = ({ size = 200 }) => {
  const pulse = usePulse();
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        width: size * 0.6, height: size * 0.7, borderRadius: size * 0.15,
        backgroundColor: ClayColors.primary,
        shadowColor: '#D4A72C', shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25, shadowRadius: 20, elevation: 10,
        alignItems: 'center', justifyContent: 'center',
        borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.5)',
        transform: [{ scale: pulse }],
      }}>
        <View style={{
          width: size * 0.25, height: size * 0.25, borderRadius: size * 0.08,
          backgroundColor: ClayColors.surface,
          shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1, shadowRadius: 8,
        }} />
      </Animated.View>
      <Animated.View style={{
        position: 'absolute', top: -8, right: 20, width: 30, height: 30, borderRadius: 15,
        backgroundColor: ClayColors.accentMint,
        shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 6,
        transform: [{ scale: pulse.interpolate({ inputRange: [1, 1.15], outputRange: [1, 1.1] }) }],
      }} />
      <Animated.View style={{
        position: 'absolute', bottom: 20, left: 15, width: 24, height: 24, borderRadius: 12,
        backgroundColor: ClayColors.accentCoral,
        shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12, shadowRadius: 5,
      }} />
    </View>
  );
};

export default function OnboardingScreen({ navigation }) {
  const { translateY, opacity } = useSlideUp(300);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
        <ClayIllustration size={220} />
        <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, marginTop: 32, textAlign: 'center', letterSpacing: -0.5 }}>
          Fresh Groceries{"\n"}Delivered
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, marginTop: 12, textAlign: 'center', paddingHorizontal: 40, lineHeight: 24 }}>
          Cute, healthy, and always on time. Your daily essentials in a whole new look.
        </Text>
      </View>
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <View style={{
          borderTopLeftRadius: ClayRadius.xxl, borderTopRightRadius: ClayRadius.xxl,
          backgroundColor: ClayColors.surface,
          shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.1, shadowRadius: 30, elevation: 20,
        }}>
          <View style={{ padding: 32, paddingBottom: 48, borderTopLeftRadius: ClayRadius.xxl, borderTopRightRadius: ClayRadius.xxl, borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.8)' }}>
            <View style={{ width: 40, height: 5, backgroundColor: ClayColors.textMuted, borderRadius: 3, alignSelf: 'center', marginBottom: 24, opacity: 0.3 }} />
            <Text style={{ fontSize: 24, fontWeight: '700', color: ClayColors.textPrimary, letterSpacing: -0.3 }}>Get Started</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, marginTop: 8, marginBottom: 24, lineHeight: 24 }}>
              Join thousands of happy customers getting their daily essentials delivered with joy.
            </Text>
            <ClayButton title="Create Account" onPress={() => navigation.navigate('Register')} />
            <View style={{ height: 16 }} />
            <ClayButton title="I Already Have an Account" variant="secondary" onPress={() => navigation.navigate('Login')} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
