import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');

  useEffect(() => {
    SecureStore.getItemAsync('token').then(token => {
      if (token) setScreen('home');
    });
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen('home');
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
    setScreen('login');
  };

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} onGoRegister={() => setScreen('register')} />;
  }

  if (screen === 'register') {
    return <RegisterScreen onLogin={handleLogin} onGoLogin={() => setScreen('login')} />;
  }

  return null;
}
