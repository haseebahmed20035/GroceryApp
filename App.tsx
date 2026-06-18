import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/Dashboard';
import CategoryScreen from './src/screens/CategoryScreen';
import ViewAllCategories from './src/screens/ViewAllCategories';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
           <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="ViewAllCategories" component={ViewAllCategories} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}