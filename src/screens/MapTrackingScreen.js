// src/screens/MapTrackingScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayCard, ClayButton } from '../components/ClayPrimitives';

const { width, height } = Dimensions.get('window');

const PlayfulMap = () => {
  const carAnim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(carAnim, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ])).start();
  }, []);

  const routePoints = [
    { x: 60, y: height * 0.35 }, { x: 140, y: height * 0.25 },
    { x: 220, y: height * 0.30 }, { x: 300, y: height * 0.22 }, { x: width - 80, y: height * 0.28 },
  ];

  const carX = carAnim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: routePoints.map(p => p.x) });
  const carY = carAnim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: routePoints.map(p => p.y) });

  return (
    <View style={{ width, height: height * 0.65, backgroundColor: '#C8E6C9', overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: 40, left: 30, width: 100, height: 100, borderRadius: 50, backgroundColor: '#A5D6A7', opacity: 0.6 }} />
      <View style={{ position: 'absolute', bottom: 80, right: 40, width: 140, height: 140, borderRadius: 70, backgroundColor: '#A5D6A7', opacity: 0.5 }} />
      <View style={{ position: 'absolute', top: height * 0.20, left: 40, width: width - 80, height: 14, borderRadius: 7, backgroundColor: '#FAFAFA', opacity: 0.9 }} />
      <View style={{ position: 'absolute', top: height * 0.20, left: width * 0.45, width: 14, height: 180, borderRadius: 7, backgroundColor: '#FAFAFA', opacity: 0.9 }} />
      <View style={{ position: 'absolute', top: height * 0.35, left: 60, width: width * 0.5, height: 14, borderRadius: 7, backgroundColor: '#FAFAFA', opacity: 0.9 }} />
      <View style={{ position: 'absolute', top: height * 0.35, left: 60, width: width - 140, height: 6, borderRadius: 3, backgroundColor: ClayColors.accentPurple, opacity: 0.8 }} />
      <View style={{ position: 'absolute', top: routePoints[routePoints.length - 1].y - 20, left: routePoints[routePoints.length - 1].x - 20 }}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: ClayColors.accentCoral, alignItems: 'center', justifyContent: 'center', ...ClayShadows.float, borderWidth: 3, borderColor: '#fff' }}>
            <Text style={{ fontSize: 18 }}>🏠</Text>
          </View>
        </Animated.View>
      </View>
      <Animated.View style={{ position: 'absolute', top: carY, left: carX, transform: [{ translateX: -20 }, { translateY: -20 }], zIndex: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: ClayColors.primary, alignItems: 'center', justifyContent: 'center', ...ClayShadows.button, borderWidth: 3, borderColor: '#fff', borderTopWidth: 3, borderTopColor: 'rgba(255,255,255,0.6)' }}>
          <Text style={{ fontSize: 20 }}>🚚</Text>
        </View>
      </Animated.View>
      {[{x: 50, y: height*0.15}, {x: width-60, y: height*0.18}, {x: 80, y: height*0.45}, {x: width-100, y: height*0.40}].map((tree, i) => (
        <View key={i} style={{ position: 'absolute', top: tree.y, left: tree.x, width: 24, height: 24, borderRadius: 12, backgroundColor: '#81C784', shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4 }} />
      ))}
    </View>
  );
};

export default function MapTrackingScreen({ navigation }) {
  const slideUp = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    Animated.spring(slideUp, { toValue: 0, friction: 5, tension: 80, delay: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <PlayfulMap />
      <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: [{ translateY: slideUp }] }}>
        <View style={[{ borderTopLeftRadius: ClayRadius.xxl, borderTopRightRadius: ClayRadius.xxl, backgroundColor: ClayColors.surface, padding: 28, paddingBottom: 40 }, ClayShadows.float]}>
          <View style={{ width: 40, height: 5, backgroundColor: ClayColors.textMuted, borderRadius: 3, alignSelf: 'center', marginBottom: 20, opacity: 0.3 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: ClayColors.bgPrimary, marginRight: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Text style={{ fontSize: 28 }}>👨‍🌾</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textPrimary }}>Ronald Richards</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: ClayColors.textMuted, letterSpacing: 0.3 }}>Your Delivery Partner</Text>
            </View>
            <View style={[{ width: 44, height: 44, borderRadius: ClayRadius.md, backgroundColor: ClayColors.primary, alignItems: 'center', justifyContent: 'center' }, ClayShadows.button]}>
              <Text style={{ fontSize: 18 }}>📞</Text>
            </View>
          </View>
          <ClayCard padding={16} style={{ marginBottom: 20, backgroundColor: ClayColors.bgPrimary, borderRadius: ClayRadius.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: ClayColors.textMuted, letterSpacing: 0.3, marginBottom: 4 }}>Estimated Time</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.textPrimary }}>20-25 min</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: ClayColors.textMuted, letterSpacing: 0.3, marginBottom: 4 }}>Distance</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: ClayColors.textPrimary }}>2.4 km</Text>
              </View>
            </View>
          </ClayCard>
          <ClayButton title="Live Tracking" onPress={() => {}} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
