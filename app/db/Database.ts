import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon.db');

export const getMenuItemsByFilters = (categories = [], searchQuery = '') => {
  return new Promise((resolve, reject) => {
    const conditions = [];
    const params: string[] = [];

    if (categories.length) {
      conditions.push(`category IN (${categories.map(() => '?').join(',')})`);
      params.push(...categories);
    }

    if (searchQuery) {
      conditions.push(`LOWER(name) LIKE ?`);
      params.push(`%${searchQuery.toLowerCase()}%`);
    }

    const query = `SELECT * FROM menu ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}`;
    
    db.transaction(tx => {
      tx.executeSql(query, params, (_, { rows }) => {
        resolve(rows._array);
      }, (_, err) => {
        reject(err);
        return true;
      });
    });
  });
};
