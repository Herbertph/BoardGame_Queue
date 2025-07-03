import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

type RouteParams = {
  publisherId: string;
  publisherName: string;
};

type RootStackParamList = {
  AdminQueue: { gameId: string; gameName: string };
};

export default function AdminDashboardScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { publisherId, publisherName } = route.params as RouteParams;

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
    navigation.navigate('AdminQueue', { gameId: game.id, gameName: game.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar: {publisherName}</Text>
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity style={styles.button} onPress={() => goToQueue(item)}>
                <Text style={styles.buttonText}>Gerenciar Fila</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  image: { width: 60, height: 60, marginRight: 10, borderRadius: 4 },
  name: { fontSize: 18, fontWeight: 'bold' },
  button: {
    marginTop: 8,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  buttonText: { color: '#fff' }
});
