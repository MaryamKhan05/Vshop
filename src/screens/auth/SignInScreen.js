import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button, Link, Loader } from "../../components/index";

const SignIn = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user.uid;
        await AsyncStorage.setItem("uid", userCredential.user?.uid);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode);
      });
  };
  return (
    <SafeAreaView
      style={[
        STYLES.container,
        { backgroundColor: COLORS.blue, justifyContent: "center" },
      ]}
    >
      <Text style={[STYLES.heading, { color: COLORS.white }]}>
        Welcome Back!{" "}
      </Text>
      {/* email */}
      <View style={STYLES.textinputConatiner}>
        <FontAwesome
          name="envelope"
          size={18}
          color="white"
          style={{ left: 10 }}
        />
        <TextInput
          style={STYLES.input}
          placeholder="Enter Email"
          placeholderTextColor={"white"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize={false}
          keyboardType="email-address"
        />
      </View>
      {/* password */}
      <View style={STYLES.textinputConatiner}>
        <Entypo name="lock" size={18} color="white" style={{ left: 10 }} />
        <TextInput
          style={STYLES.input}
          placeholder="Enter Password"
          placeholderTextColor={"white"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize={false}
        />
      </View>
      <TouchableOpacity style={{ marginVertical: 15 }} onPress={handleSignIn}>
        <Button title="Log In" bg="white" clr={COLORS.blue} />
      </TouchableOpacity>
      <Link text=" Don't have an account?" screen="Sign Up" />
      <StatusBar style="light" />

      {loading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SignIn;
