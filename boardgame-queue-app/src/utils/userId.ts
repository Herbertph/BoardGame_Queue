import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

export const getOrCreateUserId = async (): Promise<string> => {
  const existingId = await AsyncStorage.getItem('userId');
  if (existingId) return existingId;

  const newId = uuid.v4() as string;
  await AsyncStorage.setItem('userId', newId);
  return newId;
};
