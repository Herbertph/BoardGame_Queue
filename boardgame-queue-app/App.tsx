// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublishersScreen from './src/screens/PublishersScreen';
import GamesScreen from './src/screens/GamesScreen';
import QueueScreen from './src/screens/QueueScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminQueueScreen from './src/screens/AdminQueueScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Publishers" component={PublishersScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
        <Stack.Screen name="Queue" component={QueueScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="AdminQueue" component={AdminQueueScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
