// Splash.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Splash: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Loading Little Lemon...</Text>
  </View>
);

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
