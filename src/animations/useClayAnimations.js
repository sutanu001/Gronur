// src/animations/useClayAnimations.js
import { useRef, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const SPRING = { friction: 4, tension: 120, useNativeDriver: true };

export const useBouncePress = (scaleTo = 0.92) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: scaleTo, ...SPRING }).start();
  }, [scaleTo]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, ...SPRING }).start();
  }, []);
  return { scale, pressIn, pressOut };
};

export const useStaggeredEntrance = (itemCount, baseDelay = 80) => {
  const anims = useRef(Array.from({ length: itemCount }, () => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(baseDelay, anims.map(a =>
      Animated.spring(a, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })
    )).start();
  }, []);
  const getStyle = (i) => ({
    opacity: anims[i],
    transform: [
      { scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
      { translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
    ],
  });
  return { getStyle };
};

export const usePulse = () => {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.15, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  return pulse;
};

export const useSlideUp = (delay = 0) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 700, delay, easing: Easing.bezier(0.34, 1.56, 0.64, 1), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { translateY, opacity };
};

export const useParallaxScroll = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 200], outputRange: [0, -50], extrapolate: 'clamp',
  });
  return { scrollY, headerTranslate };
};
