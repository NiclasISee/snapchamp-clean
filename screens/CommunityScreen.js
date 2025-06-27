import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(list);
    });
    return () => unsubscribe();
  }, []);

  // Dummy-Daten
  const dummyActive = [
    { id: '1', name: 'ActiveStars', description: 'Top aktiv ✨', isPrivate: false },
    { id: '2', name: 'SnapWarriors', description: 'Immer online', isPrivate: false },
    { id: '3', name: 'DailySnappers', description: '🔥 Hoch aktiv', isPrivate: true },
  ];

  const dummyLargest = [
    { id: '4', name: 'MegaCommunity', description: 'Riesige Gruppe', isPrivate: false },
    { id: '5', name: 'FotoFreunde', description: 'Viele Mitglieder 👥', isPrivate: false },
    { id: '6', name: 'GlobalSnaps', description: 'International 🌍', isPrivate: true },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', { communityId: item.id })}
    >
      <View style={[styles.chatImage, { backgroundColor: '#ccc' }]} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>
          {item.name} {item.isPrivate ? '🔒' : '🌍'}
        </Text>
        <Text style={styles.chatMessage}>{item.description || 'Keine Beschreibung'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Suchleiste */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TextInput
          style={[styles.searchInput, { flex: 1 }]}
          placeholder="🔍 Community suchen"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CreateCommunity')}>
          <Text style={styles.addButton}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 Aktivste Communitys */}
      <Text style={styles.sectionTitle}>🔥 Aktivste Communitys</Text>
      <FlatList
        data={dummyActive}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.horizontalList}
      />

      {/* 👑 Größte Communitys */}
      <Text style={styles.sectionTitle}>👑 Größte Communitys</Text>
      <FlatList
        data={dummyLargest}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.horizontalList}
      />

      {/* 🌐 Alle Communitys */}
      <Text style={styles.sectionTitle}>🌐 Alle Communitys</Text>
      <FlatList
        data={communities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginRight: 12,
    width: 250,
  },
  chatImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  chatMessage: {
    color: '#555',
    fontSize: 14,
  },
  addButton: {
    fontSize: 24,
    marginLeft: 10,
    padding: 6,
    color: '#007bff',
  },
  horizontalList: {
    paddingBottom: 10,
  },
});
