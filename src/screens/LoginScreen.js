// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayButton, ClayCard, ClayInput } from '../components/ClayPrimitives';
import { AuthContext } from '../context/AuthContext';
import { useSlideUp, usePulse } from '../animations/useClayAnimations';

const ClayLockIllustration = () => {
  const pulse = usePulse();
  return (
    <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <Animated.View style={{
        width: 70, height: 70, borderRadius: 20,
        backgroundColor: ClayColors.primary,
        shadowColor: '#D4A72C', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
        alignItems: 'center', justifyContent: 'center',
        borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.5)',
        transform: [{ scale: pulse }],
      }}>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: ClayColors.surface }} />
      </Animated.View>
      <Animated.View style={{
        position: 'absolute', top: 12, width: 44, height: 44,
        borderRadius: 22, borderWidth: 6, borderColor: ClayColors.accentPurple,
        borderBottomWidth: 0, borderRightWidth: 6,
        transform: [{ scale: pulse }],
        zIndex: -1,
      }} />
    </View>
  );
};

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { translateY, opacity } = useSlideUp(150);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <ClayLockIllustration />
            <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5 }}>Welcome Back</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, marginTop: 6 }}>Sign in to continue shopping</Text>
          </View>

          <Animated.View style={{ transform: [{ translateY }], opacity }}>
            <ClayCard padding={28}>
              {error ? (
                <View style={{
                  backgroundColor: ClayColors.accentCoral + '15',
                  borderColor: ClayColors.accentCoral,
                  borderWidth: 1,
                  borderRadius: ClayRadius.sm,
                  padding: 12,
                  marginBottom: 16,
                }}>
                  <Text style={{ color: ClayColors.accentCoral, fontWeight: '700', fontSize: 14 }}>⚠️ {error}</Text>
                </View>
              ) : null}

              <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary, marginBottom: 8, marginLeft: 4 }}>EMAIL ADDRESS</Text>
              <ClayInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 20 }}
              />

              <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary, marginBottom: 8, marginLeft: 4 }}>PASSWORD</Text>
              <ClayInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 24 }}
              />

              <ClayButton
                title={loading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                style={{ marginBottom: 16 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: ClayColors.textSecondary }}>Don't have an account? </Text>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Register')}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: ClayColors.primary }}>Register</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </ClayCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
