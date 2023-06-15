import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, MainTabParamList } from "./types";

import HomeScreen from "../screens/HomeScreen";
import UserPageScreen from "../screens/UserPageScreen";
import SkincareTypeScreen from "../screens/SkinTypeScreen";
import UserRoutinePageScreen from "../screens/UserRoutinePageScreen";
import AddJournalScreen from "../screens/AddJournalScreen";
import SearchToAddScreen from "../screens/SearchToAddScreen";
import JournalHistoryScreen from "../screens/JournalHistoryScreen";
import CreateNewRoutineScreen from "../screens/CreateNewRoutineScreen";
import SearchToAddNewScreen from "../screens/SearchToAddNewScreen";
import UsersLikesScreen from "../screens/UsersLikesScreen";
import UserAccountScreen from "../screens/UserAccountScreen";
import TabIcon from "../components/TabIcon";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const Apptabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: "white",
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#B7C4CF",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 100,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            IconComponent="Entypo"
            icon="home"
            size={30}
          />
        ),
      }}
    />
    <Tab.Screen
      name="UserPage"
      component={UserPageScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            IconComponent="FontAwesome5"
            icon="user-alt"
            size={30}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Likes"
      component={UsersLikesScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            IconComponent="FontAwesome"
            icon="heart"
            size={30}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Account"
      component={UserAccountScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            IconComponent="Ionicons"
            icon="settings"
            size={30}
          />
        ),
      }}
    />
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
    <Stack.Screen
      name="UserRoutinePageScreen"
      component={UserRoutinePageScreen}
    />
    <Stack.Screen name="AddJournalScreen" component={AddJournalScreen} />
    <Stack.Screen name="SearchToAddScreen" component={SearchToAddScreen} />
    <Stack.Screen
      name="JournalHistoryScreen"
      component={JournalHistoryScreen}
    />
    <Stack.Screen
      name="CreateNewRoutineScreen"
      component={CreateNewRoutineScreen}
    />
    <Stack.Screen
      name="SearchToAddNewScreen"
      component={SearchToAddNewScreen}
    />
  </Stack.Navigator>
);

export default HomeStack;
