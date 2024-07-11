

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { Dashboard, UserProfile, Cart } from "../screens/Customer/index";
import COLORS from "../../assets/colors/colors";

const Tab = createBottomTabNavigator();

export default function MyTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.gray,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="home"
              size={size}
              color={focused ? COLORS.blue : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="shopping-cart"
              size={22}
              color={focused ? COLORS.blue : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="account"
              size={size}
              color={focused ? COLORS.blue : color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
