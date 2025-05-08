import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import CategoryFilter from '../components/CategoryFilter';
import HeroBanner from '../components/HeroBanner';
import { getMenuItemsByFilters } from '../db/database';
import { useDebounce } from '../hooks/useDebounce';

const db = openDatabase('little_lemon.db');

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';
const IMAGE_BASE_URL = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

const Home = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
const [selectedCategories, setSelectedCategories] = useState([]);
const debouncedSearch = useDebounce(search);

  // Create DB table
  const setupDatabase = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          price TEXT,
          image TEXT,
          category TEXT
        );`
      );
    });
  };

  // Fetch from remote
  const fetchMenuFromAPI = async () => {
    try {
      const response = await axios.get(API_URL);
      const items = response.data.menu;

      db.transaction(tx => {
        tx.executeSql('DELETE FROM menu'); // Reset DB
        items.forEach(item => {
          tx.executeSql(
            `INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)`,
            [item.name, item.description, item.price, item.image, item.category]
          );
        });
      });

      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Load from SQLite
  const loadMenuFromDB = () => {
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM menu`, [], (_, { rows }) => {
        setMenuItems(rows._array);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    getMenuItemsByFilters(selectedCategories, debouncedSearch)
      .then(setMenuItems)
      .catch(err => console.error(err));
  }, [selectedCategories, debouncedSearch]);
  
  // Check and load
  useEffect(() => {
    setupDatabase();
    db.transaction(tx => {
      tx.executeSql(`SELECT COUNT(*) as count FROM menu`, [], (_, { rows }) => {
        const count = rows._array[0].count;
        if (count === 0) {
          fetchMenuFromAPI();
        } else {
          loadMenuFromDB();
        }
      });
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.image}?raw=true` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🍋 Little Lemon</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../assets/avatar-placeholder.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <HeroBanner search={search} setSearch={setSearch} />
<CategoryFilter
  categories={['Starters', 'Mains', 'Desserts', 'Drinks', 'Specials']}
  selected={selectedCategories}
  onChange={toggleCategory}
/>

      {loading ? (
        <ActivityIndicator size="large" color="#f4ce14" />
      ) : (
        <FlatList
          data={menuItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.name + index}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

export default Home;
