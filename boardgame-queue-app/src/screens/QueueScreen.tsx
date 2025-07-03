import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getOrCreateUserId } from '../utils/userId';
import { deleteDoc } from 'firebase/firestore';

interface QueueEntry {
  id: string;
  userId: string;
  enteredAt: string;
  status: string;
}

export default function QueueScreen() {
  const route = useRoute();
  const { gameId, gameName } = route.params as { gameId: string; gameName: string };
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [userInQueue, setUserInQueue] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const userId = await getOrCreateUserId();

    const q = query(
      collection(db, 'Queues'),
      where('gameId', '==', gameId),
      where('status', '==', 'esperando')
    );

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      if (data.userId === userId) setPosition(index + 1);
      return { id: doc.id, ...data } as QueueEntry;
    });

    setQueue(docs);
    setUserInQueue(docs.some((entry) => entry.userId === userId));
    setLoading(false);
  };

  const handleEnterQueue = async () => {
  const userId = await getOrCreateUserId();

  // Verifica se o usuário já está em qualquer fila ativa
  const q = query(
    collection(db, 'Queues'),
    where('userId', '==', userId),
    where('status', '==', 'esperando')
  );

  const snapshot = await getDocs(q);

  // Se já estiver em outra fila
  const alreadyInAnotherQueue = snapshot.docs.some(doc => doc.data().gameId !== gameId);
  const alreadyInThisQueue = snapshot.docs.some(doc => doc.data().gameId === gameId);

  if (alreadyInAnotherQueue) {
    alert('Você já está em outra fila. Saia dela antes de entrar em uma nova.');
    return;
  }

  // Se já está nessa fila, evita duplicar
  if (alreadyInThisQueue) {
    alert('Você já está nessa fila.');
    return;
  }

  // Tudo certo, adiciona à fila
  await addDoc(collection(db, 'Queues'), {
    gameId,
    userId,
    enteredAt: new Date().toISOString(),
    status: 'esperando',
  });

  await loadQueue();
};


  const handleLeaveQueue = async () => {
    const userId = await getOrCreateUserId();

    const q = query(
      collection(db, 'Queues'),
      where('gameId', '==', gameId),
      where('userId', '==', userId),
      where('status', '==', 'esperando')
    );

    const snapshot = await getDocs(q);
    const deletions = snapshot.docs.map(doc => deleteDoc(doc.ref));


    await Promise.all(deletions);

    alert('Você saiu da fila com sucesso!');
    await loadQueue();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameName}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.info}>Há {queue.length} pessoa(s) na fila</Text>
          {userInQueue && position ? (
            <>
              <Text style={styles.position}>Você está na posição #{position}</Text>
              <View style={{ marginTop: 10 }}>
                <Button title="Sair da fila" color="#d9534f" onPress={handleLeaveQueue} />
              </View>
            </>
          ) : (
            <Button title="Entrar na fila" onPress={handleEnterQueue} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10 },
  position: { fontSize: 20, fontWeight: 'bold', color: 'green' },
});
