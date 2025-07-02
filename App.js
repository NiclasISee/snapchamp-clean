import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import VotingScreen from './screens/VotingScreen';
import ProfileStack from './navigation/ProfileStack';
import CommunityStack from './navigation/CommunityStack';
import SpinRewardScreen from './screens/SpinRewardScreen';
import AuthStack from './navigation/AuthStack';
import MakingOfFeedScreen from './screens/MakingOfFeedScreen';
import { AppProvider } from './AppContext';
import LoginScreen from './screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: () => null,
        tabBarStyle: {
          height: 60,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingBottom: 40,
          paddingHorizontal: 20,
        },
      }}
    >
      <Tab.Screen
        name="Start"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: focused ? 30 : 26 }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Voting"
        component={VotingScreen}
        options={{
          headerShown: true,
          title: 'Voting',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: focused ? 30 : 26 }}>⭐️</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: focused ? 30 : 26 }}>👤</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Communitys"
        component={CommunityStack}
        options={{
          headerShown: true,
          title: 'Communitys',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: focused ? 30 : 26 }}>💬</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen name="MakingOfFeed" component={MakingOfFeedScreen} />
          <Stack.Screen name="SpinRewardScreen" component={SpinRewardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
