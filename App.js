// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ClayColors } from './src/theme/clayTheme';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor={ClayColors.bgPrimary} />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
