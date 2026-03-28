import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MatchScreen from './src/screens/MatchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
const Tab = createBottomTabNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');
  useEffect(() => { SecureStore.getItemAsync('token').then(token => { if (token) setScreen('home'); }); }, []);
  const handleLogin = (userData) => { setUser(userData); setScreen('home'); };
  const handleLogout = () => { setUser(null); setScreen('login'); };
  if (screen === 'login') return <LoginScreen onLogin={handleLogin} onGoRegister={() => setScreen('register')} />;
  if (screen === 'register') return <RegisterScreen onLogin={handleLogin} onGoLogin={() => setScreen('login')} />;
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2E75B6' }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>H</Text> }} />
        <Tab.Screen name="Match" component={MatchScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>M</Text> }} />
        <Tab.Screen name="Profile" options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>P</Text> }}>
          {() => <ProfileScreen onLogout={handleLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
