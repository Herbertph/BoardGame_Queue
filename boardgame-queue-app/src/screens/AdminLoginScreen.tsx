import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  AdminDashboard: { publisherId: string; publisherName: string };
};

export default function AdminLoginScreen() {
  const [adminCode, setAdminCode] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!adminCode.trim()) {
      Alert.alert('Erro', 'Digite o código da editora.');
      return;
    }

    const q = query(collection(db, 'Publishers'), where('adminCode', '==', adminCode.trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      Alert.alert('Código inválido', 'Nenhuma editora encontrada com esse código.');
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const publisherId = doc.id;

    navigation.navigate('AdminDashboard', {
      publisherId,
      publisherName: data.name
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso do Organizador</Text>
      <TextInput
        placeholder="Digite o código secreto"
        style={styles.input}
        value={adminCode}
        onChangeText={setAdminCode}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16
  }
});
