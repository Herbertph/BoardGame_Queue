import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

interface QueueEntry {
  id: string;
  userId: string;
  enteredAt: string;
  status: string;
}

export default function AdminQueueScreen() {
  const route = useRoute();
  const { gameId, gameName } = route.params as { gameId: string; gameName: string };
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    const q = query(
      collection(db, 'Queues'),
      where('gameId', '==', gameId),
      where('status', '==', 'esperando'),
      orderBy('enteredAt')
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data()
    })) as QueueEntry[];

    setQueue(docs);
    setLoading(false);
  };

  const handleMarkPresent = async (entry: QueueEntry) => {
    await updateDoc(doc(db, 'Queues', entry.id), {
      status: 'atendido'
    });
    fetchQueue();
  };

  const handleRemove = async (entry: QueueEntry) => {
    Alert.alert(
      'Remover da fila',
      'Tem certeza que deseja remover esta pessoa da fila?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'Queues', entry.id));
            fetchQueue();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fila: {gameName}</Text>
      {queue.length === 0 ? (
        <Text style={styles.empty}>Nenhuma pessoa na fila</Text>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.text}>#{index + 1}</Text>
              <View style={styles.actions}>
                <Button title="✅ Presente" onPress={() => handleMarkPresent(item)} />
                <View style={{ marginTop: 5 }} />
                <Button title="❌ Remover" color="#d9534f" onPress={() => handleRemove(item)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  empty: { fontSize: 18, color: '#888' },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: { fontSize: 18, fontWeight: 'bold' },
  actions: { justifyContent: 'center' }
});
