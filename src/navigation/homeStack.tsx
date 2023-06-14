import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import UserPageScreen from '../screens/UserPageScreen';
import SkincareTypeScreen from '../screens/SkinTypeScreen';
import UserRoutinePageScreen from '../screens/UserRoutinePageScreen';
import AddJournalScreen from '../screens/AddJournalScreen';
import SearchToAddScreen from '../screens/SearchToAddScreen';
import JournalHistoryScreen from '../screens/JournalHistoryScreen';
import CreateNewRoutineScreen from '../screens/CreateNewRoutineScreen';
import SearchToAddNewScreen from '../screens/SearchToAddNewScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const Apptabs: React.FC = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        headerShown: false,
        tabBarStyle: { backgroundColor: "rgba(1,90,131,255)" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="UserPage" component={UserPageScreen}></Tab.Screen>
    </Tab.Navigator>
  );

const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeScreen" component={Apptabs} />
    <Stack.Screen name="SkincareType" component={SkincareTypeScreen} />
    <Stack.Screen name="UserRoutinePageScreen" component={UserRoutinePageScreen} />
    <Stack.Screen name="AddJournalScreen" component={AddJournalScreen} />
    <Stack.Screen name="SearchToAddScreen" component={SearchToAddScreen} />
    <Stack.Screen name="JournalHistoryScreen" component={JournalHistoryScreen} />
    <Stack.Screen name="CreateNewRoutineScreen" component={CreateNewRoutineScreen} />
    <Stack.Screen name="SearchToAddNewScreen" component={SearchToAddNewScreen}/>
  </Stack.Navigator>
);


export default HomeStack;
