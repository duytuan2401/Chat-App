import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
<<<<<<< HEAD
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  LoginScreen,
  SignUpScreen,
  SplashScreen,
  AddToChatScreen,
  ChatScreen,
} from "./screens";
=======
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddToChatScreen, ChatScreen, HomeScreen, LoginScreen, SignUpScreen, SplashScreen } from "./screens";
>>>>>>> 1885612b7baee41efa14251978bd3eed937f962d

import { Provider } from "react-redux";
import Store from "./context/store";
import ProfileScreen from "./screens/ProfileScreen";
import AccountScreen from "./screens/AccountScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="AddToChatScreen" component={AddToChatScreen} />
<<<<<<< HEAD
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
=======
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          
>>>>>>> 1885612b7baee41efa14251978bd3eed937f962d
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
