import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import api from '../utils/api';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/me');
      setUsers([res.data]);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={s.card}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>{item.nickname?.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={s.cardBody}>
        <Text style={s.name}>{item.nickname}</Text>
        <Text style={s.info}>{item.gender || 'No gender set'} | Age: {item.age || '?'}</Text>
        <View style={s.tagRow}>
          {(item.interests || []).map((tag, i) => (
            <View key={i} style={s.tag}><Text style={s.tagText}>{tag}</Text></View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>TMB</Text>
        <Text style={s.headerSub}>Discover people nearby</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderCard}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={s.empty}>No users found</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1A3A5C', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: '#aac4e0', marginTop: 4 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#2E75B6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  cardBody: { marginLeft: 14, flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1A3A5C' },
  info: { fontSize: 13, color: '#888', marginTop: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { backgroundColor: '#E6F1FB', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 4 },
  tagText: { fontSize: 12, color: '#2E75B6' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
