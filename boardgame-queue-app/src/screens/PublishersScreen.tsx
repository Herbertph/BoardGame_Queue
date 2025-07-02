// src/screens/PublishersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';

interface Publisher {
  id: string;
  name: string;
  logoUrl: string;
}

// Define the navigation param list for your stack
type RootStackParamList = {
  Publishers: undefined;
  Games: { publisherId: string; publisherName: string };
};

export default function PublishersScreen() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPublishers = async () => {
      const snapshot = await getDocs(collection(db, 'Publishers'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Publisher[];
      setPublishers(data);
    };

    fetchPublishers();
  }, []);

  const goToGames = (publisher: Publisher) => {
    navigation.navigate('Games', { publisherId: publisher.id, publisherName: publisher.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma Editora</Text>
      <FlatList
        data={publishers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goToGames(item)}>
            <Image source={{ uri: item.logoUrl }} style={styles.logo} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 10 },
  name: { fontSize: 18 }
});
