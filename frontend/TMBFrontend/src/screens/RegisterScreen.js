import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';

export default function RegisterScreen({ onLogin, onGoLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !nickname) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password, nickname });
      await SecureStore.setItemAsync('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TMB</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onGoLogin}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#1A3A5C' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: '#2E75B6', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#2E75B6', marginTop: 20, fontSize: 14 },
});