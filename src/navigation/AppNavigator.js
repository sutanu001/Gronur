// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { useBouncePress } from '../animations/useClayAnimations';
import { AuthContext } from '../context/AuthContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MapTrackingScreen from '../screens/MapTrackingScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ClayTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{
      position: 'absolute', bottom: 24, left: 24, right: 24, height: 72,
      borderRadius: ClayRadius.xl, backgroundColor: ClayColors.surface,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
      ...ClayShadows.float, borderTopWidth: 1.5, borderTopColor: 'rgba(255,255,255,0.8)',
    }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { scale, pressIn, pressOut } = useBouncePress(0.8);
        const icons = { Home: '🏠', Orders: '📋', Cart: '🛒', Profile: '👤' };
        const label = route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Animated.View key={route.key} style={{ transform: [{ scale }] }}>
            <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
                {isFocused && (
                  <View style={{
                    position: 'absolute', width: 48, height: 48, borderRadius: 24,
                    backgroundColor: ClayColors.primary, ...ClayShadows.button,
                    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.5)',
                  }} />
                )}
                <Text style={{ fontSize: 22, zIndex: 1 }}>{icons[label] || '📦'}</Text>
                {isFocused && (
                  <Text style={{ fontSize: 10, fontWeight: '800', color: ClayColors.textOnPrimary, marginTop: 2, zIndex: 1 }}>{label}</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <ClayTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CheckoutScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ClayLoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: ClayColors.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: 80, height: 80, borderRadius: 40, backgroundColor: ClayColors.primary,
        borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.6)',
        shadowColor: '#D4A72C', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 32 }}>🛍️</Text>
      </View>
      <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '700', color: ClayColors.textSecondary }}>
        Loading Gronur...
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <ClayLoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: ClayColors.bgPrimary } }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="MapTracking" component={MapTrackingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
