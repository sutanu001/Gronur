// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { auth, db, isFirebaseConfigured } from '../firebase/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

import { initDb, executeSql } from '../database/db'; // Local sandbox driver fallback

export const AuthContext = createContext();

// Session persistence wrappers
const setSession = async (key, val) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, val);
    } catch {}
  } else {
    try {
      await SecureStore.setItemAsync(key, val);
    } catch {}
  }
};

const getSession = async (key) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
};

const deleteSession = async (key) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {}
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders helper
  const fetchUserOrders = async (userId) => {
    if (isFirebaseConfigured) {
      try {
        const q = query(collection(db, 'orders'), where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({ 
            id: doc.id, 
            ...data,
            price: parseFloat(data.price),
            qty: parseInt(data.qty)
          });
        });
        setOrders(fetched);
      } catch (err) {
        console.warn("Failed to fetch cloud orders:", err);
      }
    } else {
      try {
        const result = await executeSql(
          'SELECT * FROM orders WHERE user_id = ?',
          [userId]
        );
        const fetched = result.rows.map(o => ({
          id: o.id.toString(),
          user_id: o.user_id.toString(),
          item: o.item,
          price: parseFloat(o.price),
          qty: parseInt(o.qty),
          status: o.status,
          date: o.date,
          emoji: o.emoji,
        }));
        setOrders(fetched);
      } catch (err) {
        console.warn("Failed to fetch local orders:", err);
      }
    }
  };

  useEffect(() => {
    if (isFirebaseConfigured) {
      // 1. Firebase Active Observer Mode
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            const profile = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || firebaseUser.displayName || 'User',
            };
            setUser(profile);
            await fetchUserOrders(firebaseUser.uid);
          } catch (e) {
            console.warn("Failed fetching Firestore profile:", e);
            const fallbackProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
            };
            setUser(fallbackProfile);
            await fetchUserOrders(firebaseUser.uid);
          }
        } else {
          setUser(null);
          setOrders([]);
          setCartItems([]);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // 2. Sandboxed Local DB Mode
      const bootstrapSandbox = async () => {
        await initDb();
        try {
          const storedUser = await getSession('active_user');
          if (storedUser) {
            const profile = JSON.parse(storedUser);
            setUser(profile);
            await fetchUserOrders(profile.id);
          }
        } catch (e) {
          console.warn("Failed retrieving local session:", e);
        } finally {
          setLoading(false);
        }
      };
      bootstrapSandbox();
    }
  }, []);

  const login = async (email, password) => {
    if (!email || !password) throw new Error('Please fill in all fields.');
    const cleanEmail = email.toLowerCase().trim();

    if (isFirebaseConfigured) {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const profile = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name || 'User',
      };
      setUser(profile);
      await fetchUserOrders(firebaseUser.uid);
      return profile;
    } else {
      const result = await executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [cleanEmail, password]
      );
      if (result.rows.length === 0) {
        throw new Error('Invalid email or password.');
      }
      const profile = {
        id: result.rows[0].id.toString(),
        name: result.rows[0].name,
        email: result.rows[0].email,
      };
      setUser(profile);
      await setSession('active_user', JSON.stringify(profile));
      await fetchUserOrders(profile.id);
      return profile;
    }
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error('Please fill in all fields.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const cleanEmail = email.toLowerCase().trim();

    if (isFirebaseConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const firebaseUser = userCredential.user;

      const profile = {
        name: name.trim(),
        email: cleanEmail,
        created_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);

      const loadedUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: profile.name,
      };
      setUser(loadedUser);
      setOrders([]);
      setCartItems([]);
      return loadedUser;
    } else {
      const checkResult = await executeSql('SELECT * FROM users WHERE email = ?', [cleanEmail]);
      if (checkResult.rows.length > 0) {
        throw new Error('This email is already registered.');
      }
      const insertResult = await executeSql(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name.trim(), cleanEmail, password]
      );
      const profile = {
        id: insertResult.insertId.toString(),
        name: name.trim(),
        email: cleanEmail,
      };
      setUser(profile);
      await setSession('active_user', JSON.stringify(profile));
      setOrders([]);
      setCartItems([]);
      return profile;
    }
  };

  const addOrder = async (item, price, qty, status, emoji) => {
    if (!user) return;
    const dateStr = "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isFirebaseConfigured) {
      try {
        const orderData = {
          user_id: user.id,
          item,
          price: price.toString(),
          qty: parseInt(qty),
          status,
          date: dateStr,
          emoji,
        };
        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setOrders(prev => [{ id: docRef.id, ...orderData, price: parseFloat(price), qty: parseInt(qty) }, ...prev]);
      } catch (err) {
        console.warn("Failed to save cloud order:", err);
      }
    } else {
      try {
        const insertResult = await executeSql(
          'INSERT INTO orders (user_id, item, price, qty, status, date, emoji) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.id, item, price.toString(), parseInt(qty), status, dateStr, emoji]
        );
        const newOrder = {
          id: insertResult.insertId.toString(),
          user_id: user.id,
          item,
          price: parseFloat(price),
          qty: parseInt(qty),
          status,
          date: dateStr,
          emoji,
        };
        setOrders(prev => [newOrder, ...prev]);
      } catch (err) {
        console.warn("Failed to save local order:", err);
      }
    }
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + quantity };
        return next;
      }
      const emoji = product.name.toLowerCase().includes('orange') ? '🍊' : 
                    product.name.toLowerCase().includes('apple') ? '🍎' : 
                    product.name.toLowerCase().includes('strawberry') ? '🍓' : 
                    product.name.toLowerCase().includes('watermelon') ? '🍉' : 
                    product.name.toLowerCase().includes('dragon') ? '🐲' : 
                    product.name.toLowerCase().includes('capsicum') ? '🫑' : '📦';
      return [...prev, {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        qty: quantity,
        emoji: emoji,
      }];
    });
  };

  const removeFromCart = (productId, count = 1) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.id === productId);
      if (idx === -1) return prev;
      const next = [...prev];
      if (next[idx].qty <= count) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty: next[idx].qty - count };
      }
      return next;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth);
    } else {
      setUser(null);
      setOrders([]);
      setCartItems([]);
      await deleteSession('active_user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, orders, cartItems, loading, 
      login, register, logout, addOrder,
      addToCart, removeFromCart, clearCart,
      isFirebaseConfigured 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
