// src/screens/RegisterScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { ClayButton, ClayCard, ClayInput } from '../components/ClayPrimitives';
import { AuthContext } from '../context/AuthContext';
import { useSlideUp, usePulse } from '../animations/useClayAnimations';

const ClayProfileIllustration = () => {
  const pulse = usePulse();
  return (
    <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
      <Animated.View style={{
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: ClayColors.accentMint,
        shadowColor: ClayColors.shadow, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
        alignItems: 'center', justifyContent: 'center',
        borderTopWidth: 2, borderTopColor: 'rgba(255,255,255,0.6)',
        transform: [{ scale: pulse }],
      }}>
        <Text style={{ fontSize: 40 }}>🌱</Text>
      </Animated.View>
    </View>
  );
};

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { translateY, opacity } = useSlideUp(150);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ClayColors.bgPrimary }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <ClayProfileIllustration />
            <Text style={{ fontSize: 32, fontWeight: '800', color: ClayColors.textPrimary, letterSpacing: -0.5 }}>Create Account</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: ClayColors.textSecondary, marginTop: 6 }}>Join the fresh grocery movement</Text>
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

              <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary, marginBottom: 8, marginLeft: 4 }}>FULL NAME</Text>
              <ClayInput
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 16 }}
              />

              <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary, marginBottom: 8, marginLeft: 4 }}>EMAIL ADDRESS</Text>
              <ClayInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 16 }}
              />

              <Text style={{ fontSize: 14, fontWeight: '700', color: ClayColors.textSecondary, marginBottom: 8, marginLeft: 4 }}>PASSWORD</Text>
              <ClayInput
                placeholder="Choose a password (min 6 chars)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 24 }}
              />

              <ClayButton
                title={loading ? "Creating Account..." : "Register"}
                onPress={handleRegister}
                style={{ marginBottom: 16 }}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: ClayColors.textSecondary }}>Already have an account? </Text>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: ClayColors.primary }}>Sign In</Text>
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
