// navigation/ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import VisitorProfileScreen from '../screens/VisitorProfileScreen';
import MakingOfFeedScreen from '../screens/MakingOfFeedScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Dein Profil',
        headerTitleStyle: {
          fontSize: 13,
          fontWeight: 'bold',
         },
        }}
      />
      <Stack.Screen
        name="ProfilBearbeiten"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: 'Profil bearbeiten',
        }}
      />
      <Stack.Screen
        name="VisitorProfile"
        component={VisitorProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MakingOfFeed"
        component={MakingOfFeedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
