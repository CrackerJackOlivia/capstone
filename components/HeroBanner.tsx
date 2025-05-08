import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

const HeroBanner = ({ search, setSearch }) => (
  <View style={styles.container}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>Little Lemon</Text>
      <Text style={styles.subtitle}>Chicago</Text>
      <Text style={styles.desc}>We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
      <TextInput
        placeholder="Search dishes..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
    </View>
    <Image
      source={require('../assets/hero-image.png')}
      style={styles.image}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#495E57',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  desc: {
    color: '#eee',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
  }
});

export default HeroBanner;
