// src/components/ClayPrimitives.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Animated, Image } from 'react-native';
import { ClayColors, ClayRadius, ClayShadows } from '../theme/clayTheme';
import { useBouncePress } from '../animations/useClayAnimations';

export const ClayCard = ({ children, style, padding = 24, onPress }) => {
  const content = (
    <View style={[{ borderRadius: ClayRadius.xl, backgroundColor: ClayColors.surface, padding,
      borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.7)',
      borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
    }, style]}>
      {children}
    </View>
  );
  if (onPress) {
    const { scale, pressIn, pressOut } = useBouncePress(0.97);
    return (
      <View style={[{ borderRadius: ClayRadius.xl }, ClayShadows.card]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
            {content}
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );
  }
  return <View style={[{ borderRadius: ClayRadius.xl }, ClayShadows.card]}>{content}</View>;
};

export const ClayButton = ({ title, onPress, variant = 'primary', style, icon }) => {
  const { scale, pressIn, pressOut } = useBouncePress(0.9);
  const isPrimary = variant === 'primary';
  const bg = isPrimary ? ClayColors.primary : ClayColors.surface;
  const textColor = isPrimary ? ClayColors.textOnPrimary : ClayColors.textPrimary;
  const shadow = isPrimary ? ClayShadows.button : ClayShadows.card;
  return (
    <View style={[{ borderRadius: ClayRadius.md, alignSelf: 'stretch' }, shadow, style]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
          <View style={{
            borderRadius: ClayRadius.md, backgroundColor: bg,
            paddingVertical: 18, paddingHorizontal: 28,
            alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10,
            borderTopWidth: 1.5,
            borderTopColor: isPrimary ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
            borderBottomWidth: 1,
            borderBottomColor: isPrimary ? 'rgba(180,130,20,0.15)' : 'rgba(0,0,0,0.04)',
          }}>
            {icon}
            <Text style={{ fontSize: 16, fontWeight: '700', color: textColor, letterSpacing: 0.5 }}>{title}</Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export const ClayInput = ({ placeholder, value, onChangeText, style, secureTextEntry }) => (
  <View style={[{ borderRadius: ClayRadius.md }, ClayShadows.card, style]}>
    <View style={{
      borderRadius: ClayRadius.md, backgroundColor: ClayColors.surface,
      paddingVertical: 16, paddingHorizontal: 20,
      borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.8)',
      borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
    }}>
      <TextInput
        placeholder={placeholder} placeholderTextColor={ClayColors.textMuted}
        value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry}
        style={{ fontSize: 16, fontWeight: '600', color: ClayColors.textPrimary }}
      />
    </View>
  </View>
);

export const ClayBadge = ({ label, isActive, onPress }) => {
  const { scale, pressIn, pressOut } = useBouncePress(0.92);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
        <View style={{
          borderRadius: ClayRadius.full,
          backgroundColor: isActive ? ClayColors.primary : ClayColors.surface,
          paddingVertical: 10, paddingHorizontal: 20, marginRight: 10,
          ...ClayShadows.float,
          borderTopWidth: 1,
          borderTopColor: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.8)',
        }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? ClayColors.textOnPrimary : ClayColors.textSecondary }}>
            {label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export const ClayProductCard = ({ product, onPress, index }) => {
  const { scale, pressIn, pressOut } = useBouncePress(0.93);
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(entrance, { toValue: 1, friction: 6, tension: 80, delay: index * 100, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{
      flex: 1, margin: 8,
      opacity: entrance,
      transform: [
        { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
        { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
      ],
    }}>
      <View style={[{ borderRadius: ClayRadius.lg }, ClayShadows.card]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
            <View style={{
              borderRadius: ClayRadius.lg, backgroundColor: ClayColors.surface, padding: 16,
              borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.7)',
              borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
            }}>
              <View style={{
                height: 110, backgroundColor: ClayColors.bgPrimary, borderRadius: ClayRadius.md,
                marginBottom: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {product.image ? (
                  <Image source={product.image} style={{ width: 85, height: 85, resizeMode: 'contain' }} />
                ) : (
                  <View style={{
                    width: 70, height: 70, borderRadius: 35, backgroundColor: ClayColors.primaryLight,
                    shadowColor: ClayColors.primary, shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2, shadowRadius: 8,
                  }} />
                )}
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: ClayColors.textPrimary, marginBottom: 4 }}>{product.name}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: ClayColors.textMuted, marginBottom: 10 }}>{product.unit}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: ClayColors.textPrimary }}>${product.price}</Text>
                <View style={[{ borderRadius: ClayRadius.sm }, ClayShadows.button]}>
                  <View style={{
                    width: 36, height: 36, borderRadius: ClayRadius.sm, backgroundColor: ClayColors.primary,
                    alignItems: 'center', justifyContent: 'center',
                    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.5)',
                  }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: ClayColors.textOnPrimary }}>+</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </Animated.View>
  );
};
