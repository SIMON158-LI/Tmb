import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import api from '../utils/api';

const ACTIVITIES = ['Cycling', 'Mahjong', 'Board Game', 'Hiking', 'Dining', 'Sports'];

export default function MatchScreen() {
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const createMatch = async (activity) => {
    try {
      await api.post('/matches', { activity_type: activity, max_people: 4 });
      Alert.alert('Success', 'Match created!');
      fetchMatches();
    } catch (err) { Alert.alert('Error', err.response?.data?.error || 'Failed'); }
  };

  const joinMatch = async (id) => {
    try {
      await api.post('/matches/' + id + '/join');
      Alert.alert('Success', 'Joined!');
      fetchMatches();
    } catch (err) { Alert.alert('Error', err.response?.data?.error || 'Failed'); }
  };

  const renderMatch = ({ item }) => (
    <View style={s.matchCard}>
      <View style={s.matchHeader}>
        <Text style={s.matchType}>{item.activity_type}</Text>
        <Text style={s.matchPeople}>{item.current_people}/{item.max_people}</Text>
      </View>
      <Text style={s.matchCreator}>by {item.creator_name}</Text>
      <TouchableOpacity style={s.joinBtn} onPress={() => joinMatch(item.id)}>
        <Text style={s.joinText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Matching</Text>
        <Text style={s.headerSub}>Find an activity</Text>
      </View>
      <Text style={s.sectionTitle}>Create a match</Text>
      <View style={s.grid}>
        {ACTIVITIES.map(a => (
          <TouchableOpacity key={a} style={s.actBtn} onPress={() => createMatch(a)}>
            <Text style={s.actText}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.sectionTitle}>Available matches</Text>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetchMatches(); setRefreshing(false); }} />}
        ListEmptyComponent={<Text style={s.empty}>No matches yet. Create one!</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1A3A5C', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 14, color: '#aac4e0', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A3A5C', marginTop: 20, marginHorizontal: 16, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  actBtn: { backgroundColor: '#E6F1FB', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, margin: 4 },
  actText: { color: '#2E75B6', fontWeight: 'bold', fontSize: 14 },
  list: { padding: 16 },
  matchCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchType: { fontSize: 18, fontWeight: 'bold', color: '#1A3A5C' },
  matchPeople: { fontSize: 14, color: '#888' },
  matchCreator: { fontSize: 13, color: '#888', marginTop: 4 },
  joinBtn: { backgroundColor: '#2E75B6', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 12 },
  joinText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20, fontSize: 14 },
});
