// src/database/db.js
import { Platform } from 'react-native';

let executeSql;

if (Platform.OS === 'web') {
  // Web Fallback: LocalStorage mock database to guarantee web preview works perfectly
  const getTable = (name) => {
    try {
      const data = localStorage.getItem(`db_${name}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveTable = (name, rows) => {
    try {
      localStorage.setItem(`db_${name}`, JSON.stringify(rows));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  };

  executeSql = async (sql, params = []) => {
    const norm = sql.replace(/\s+/g, ' ').trim();

    if (norm.includes('CREATE TABLE')) {
      const tableName = norm.includes('users') ? 'users' : 'orders';
      if (!localStorage.getItem(`db_${tableName}`)) {
        saveTable(tableName, []);
      }
      return { rows: [], insertId: null, rowsAffected: 0 };
    }

    if (norm.includes('INSERT INTO users')) {
      const [name, email, password] = params;
      const users = getTable('users');
      if (users.some(u => u.email === email)) {
        throw new Error('Email already exists');
      }
      const newId = users.length + 1;
      const newUser = { id: newId, name, email, password, created_at: new Date().toISOString() };
      users.push(newUser);
      saveTable('users', users);
      return { rows: [], insertId: newId, rowsAffected: 1 };
    }

    if (norm.includes('SELECT * FROM users WHERE email = ? AND password = ?')) {
      const [email, password] = params;
      const users = getTable('users');
      const found = users.filter(u => u.email === email && u.password === password);
      return { rows: found, insertId: null, rowsAffected: 0 };
    }

    if (norm.includes('SELECT * FROM users WHERE email = ?')) {
      const [email] = params;
      const users = getTable('users');
      const found = users.filter(u => u.email === email);
      return { rows: found, insertId: null, rowsAffected: 0 };
    }

    if (norm.includes('INSERT INTO orders')) {
      const [user_id, item, price, qty, status, date, emoji] = params;
      const orders = getTable('orders');
      const newId = orders.length + 1;
      const newOrder = { id: newId, user_id, item, price, qty, status, date, emoji };
      orders.push(newOrder);
      saveTable('orders', orders);
      return { rows: [], insertId: newId, rowsAffected: 1 };
    }

    if (norm.includes('SELECT * FROM orders WHERE user_id = ?')) {
      const [user_id] = params;
      const orders = getTable('orders');
      const found = orders.filter(o => o.user_id === user_id);
      return { rows: found, insertId: null, rowsAffected: 0 };
    }

    return { rows: [], insertId: null, rowsAffected: 0 };
  };
} else {
  // Native SQLite driver
  const SQLite = require('expo-sqlite');
  const db = SQLite.openDatabase('gronur.db');

  executeSql = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve({
              rows: result.rows._array || [],
              insertId: result.insertId,
              rowsAffected: result.rowsAffected,
            });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };
}

export const initDb = async () => {
  try {
    await executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await executeSql(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item TEXT NOT NULL,
        price TEXT NOT NULL,
        qty INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        emoji TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

export { executeSql };
