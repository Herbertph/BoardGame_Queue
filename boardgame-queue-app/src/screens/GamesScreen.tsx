import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { NavigationProp } from '@react-navigation/native';

interface Game {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

type RootStackParamList = {
  Publishers: undefined;
  Games: { publisherId: string; publisherName: string };
  Queue: { gameId: string; gameName: string };
};

export default function GamesScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { publisherId, publisherName } = route.params as { publisherId: string; publisherName: string };
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const q = query(collection(db, 'Games'), where('publisherID', '==', publisherId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];
      setGames(data);
    };

    fetchGames();
  }, []);

  const goToQueue = (game: Game) => {
    navigation.navigate('Queue', { gameId: game.id, gameName: game.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogos da {publisherName}</Text>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <TouchableOpacity style={styles.button} onPress={() => goToQueue(item)}>
                <Text style={styles.buttonText}>Ver fila</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { flexDirection: 'row', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 },
  image: { width: 60, height: 60, marginRight: 10, borderRadius: 4 },
  name: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: { backgroundColor: '#007bff', padding: 8, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center' }
});
