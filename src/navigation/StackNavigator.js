import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dashboard,
  RolePicker,
  UserProfile,
  Cart,
  SignIn,
  SignUp,
  ItemDetails,
  Payment,
} from "../screens/Customer/index";
import MyTab from "./TabNavigator";
import { auth } from "../firebase/firebaseConfig";
import { AddItem, SellerDashboard } from "../screens/Seller/index";
import COLORS from "../../assets/colors/colors";
const Stack = createStackNavigator();

export function MyStack() {
  const [loggedIn, setLoggedIn] = useState(false);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      await AsyncStorage.setItem("userId", uid);
      setLoggedIn(true);
      // ...
    } else {
      setLoggedIn(false);
    }
  });

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator initialRouteName="">
          <Stack.Screen
            name="RolePicker"
            component={RolePicker}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MyTab"
            component={MyTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SellerDashboard"
            component={SellerDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add New Item"
            component={AddItem}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: COLORS.white,
              },
              headerTintColor: COLORS.white,
              headerStyle: {
                backgroundColor: COLORS.blue,
              },
            }}
          />
          <Stack.Screen
            name="ItemDetails"
            component={ItemDetails}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: COLORS.white,
              },
              headerTintColor: COLORS.white,
              headerStyle: {
                backgroundColor: COLORS.blue,
              },
            }}
          />
          <Stack.Screen
            name="My Cart"
            component={Cart}
            options={{
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: COLORS.white,
              },
              headerTintColor: COLORS.white,
              headerStyle: {
                backgroundColor: COLORS.blue,
              },
            }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{
              headerTitle: "Place Your Order",
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: COLORS.white,
              },
              headerTintColor: COLORS.white,
              headerStyle: {
                backgroundColor: COLORS.blue,
              },
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="">
          <Stack.Screen
            name="Sign In"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sign Up"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Profile" component={UserProfile} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
