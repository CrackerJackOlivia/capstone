import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CategoryFilter = ({ categories, selected, onChange }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(category => {
        const isSelected = selected.includes(category);
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onChange(category)}
            style={[
              styles.chip,
              isSelected && styles.chipSelected
            ]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexGrow: 0,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  chipSelected: {
    backgroundColor: '#495E57',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },
});

export default CategoryFilter;
