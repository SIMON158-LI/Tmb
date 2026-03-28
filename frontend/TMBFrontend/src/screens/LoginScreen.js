import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';

export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) { Alert.alert('Error', err.response?.data?.error || 'Login failed'); }
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>TMB</Text>
      <Text style={s.subtitle}>Social Matching App</Text>
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={s.button} onPress={handleLogin} disabled={loading}>
        <Text style={s.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onGoRegister}>
        <Text style={s.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#1A3A5C' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: '#2E75B6', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#2E75B6', marginTop: 20, fontSize: 14 },
});
