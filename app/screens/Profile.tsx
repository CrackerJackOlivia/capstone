// screens/Profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import MaskInput, { Masks } from 'react-native-mask-input';

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  notifications: {
    orderStatus: boolean;
    passwordChanges: boolean;
    specialOffers: boolean;
    newsletter: boolean;
  };
};

const STORAGE_KEY = '@littlelemon_profile';

const Profile: React.FC = () => {
  const [data, setData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: null,
    notifications: {
      orderStatus: true,
      passwordChanges: true,
      specialOffers: true,
      newsletter: true,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    };
    loadData();
  }, []);

  const saveData = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    Alert.alert('Success', 'Changes saved.');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logged out', 'Returning to onboarding.');
    // App state should trigger onboarding here
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'We need access to your camera roll.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ base64: false, quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      setData({ ...data, avatar: result.assets[0].uri });
    }
  };

  const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Information</Text>

      <View style={styles.avatarContainer}>
        {data.avatar ? (
          <Image source={{ uri: data.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.avatarBtn} onPress={pickImage}>
          <Text style={styles.avatarBtnText}>Change</Text>
        </TouchableOpacity>
        {data.avatar && (
          <TouchableOpacity
