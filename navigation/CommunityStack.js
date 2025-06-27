// navigation/CommunityStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/CommunityScreen';
import CommunityChatScreen from '../screens/CommunityChatScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community" component={CommunityScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={CommunityChatScreen} options={{ title: 'Community-Chat' }} />
       <Stack.Screen name="CommunityMain" component={CommunityScreen} />
  <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} />
    </Stack.Navigator>
  );
}
