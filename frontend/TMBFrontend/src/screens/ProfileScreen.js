import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';

export default function ProfileScreen({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setNickname(res.data.nickname);
      setGender(res.data.gender);
      setAge(String(res.data.age || ''));
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => {
    try {
      await api.put('/users/me', { nickname, gender, age: parseInt(age) || 0 });
      Alert.alert('Success', 'Profile updated');
      setEditing(false);
      fetchProfile();
    } catch (err) { Alert.alert('Error', err.response?.data?.error || 'Update failed'); }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    onLogout();
  };

  if (!profile) return <View style={s.container}><Text style={s.loading}>Loading...</Text></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.avatar}><Text style={s.avatarText}>{profile.nickname?.charAt(0).toUpperCase()}</Text></View>
        <Text style={s.name}>{profile.nickname}</Text>
        <Text style={s.email}>{profile.email}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.label}>Nickname</Text>
        <TextInput style={s.input} value={nickname} onChangeText={setNickname} editable={editing} />
        <Text style={s.label}>Gender</Text>
        <TextInput style={s.input} value={gender} onChangeText={setGender} editable={editing} placeholder="male / female / other" />
        <Text style={s.label}>Age</Text>
        <TextInput style={s.input} value={age} onChangeText={setAge} editable={editing} keyboardType="numeric" />
        {editing ? (
          <TouchableOpacity style={s.saveBtn} onPress={saveProfile}><Text style={s.saveBtnText}>Save</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.editBtn} onPress={() => setEditing(true)}><Text style={s.editBtnText}>Edit Profile</Text></TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}><Text style={s.logoutText}>Logout</Text></TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loading: { textAlign: 'center', marginTop: 100, color: '#999' },
  header: { backgroundColor: '#1A3A5C', paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2E75B6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  email: { fontSize: 14, color: '#aac4e0', marginTop: 4 },
  section: { padding: 20 },
  label: { fontSize: 13, color: '#888', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  editBtn: { backgroundColor: '#2E75B6', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2E8B57', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { marginHorizontal: 20, marginTop: 10, marginBottom: 40, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#CC3333' },
  logoutText: { color: '#CC3333', fontSize: 16, fontWeight: 'bold' },
});
