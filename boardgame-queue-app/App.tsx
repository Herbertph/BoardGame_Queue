import React from 'react';
import { View, Button } from 'react-native';
import { db } from './src/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
  const addTestDoc = async () => {
    try {
      await addDoc(collection(db, 'testCollection'), {
        message: 'Conexão funcionando!',
        timestamp: new Date()
      });
      alert('Documento enviado com sucesso!');
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Testar Firebase" onPress={addTestDoc} />
    </View>
  );
}
