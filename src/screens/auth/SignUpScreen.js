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

import { auth, db } from "../../firebase/firebaseConfig";
import {
  doc,
  setDoc, // Import setDoc function
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button, Link } from "../../components/index";
const SignUp = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [confirmPass, setConfirmPass] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user?.uid;
        // console.log(user, "<---- user");

        await AsyncStorage.setItem("uid", userCredential.user?.uid);
        //saving phone number and name in the firestore
        const userDocRef = doc(db, "users", user);
        await setDoc(userDocRef, { name, phone });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode);
        // ..
      });
  };
  return (
    <SafeAreaView
      style={[
        STYLES.container,
        { backgroundColor: COLORS.blue, justifyContent: "center" },
      ]}
    >
      <Text style={[STYLES.heading, { color: COLORS.white }]}>Welcome !</Text>
      {/* name */}
      <View style={STYLES.textinputConatiner}>
        <FontAwesome
          name="user-circle"
          size={18}
          color="white"
          style={{ left: 10 }}
        />
        <TextInput
          style={STYLES.input}
          placeholder="Enter Name"
          placeholderTextColor={"white"}
          value={name}
          onChangeText={(text) => setName(text)}
          autoCapitalize={false}
        />
      </View>
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
      {/* mobile */}
      <View style={STYLES.textinputConatiner}>
        <Entypo name="mobile" size={18} color="white" style={{ left: 10 }} />
        <TextInput
          style={STYLES.input}
          placeholder="Enter Mobile"
          placeholderTextColor={"white"}
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
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
      {/* confirm password */}
      <View style={STYLES.textinputConatiner}>
        <Entypo name="lock" size={18} color="white" style={{ left: 10 }} />
        <TextInput
          style={STYLES.input}
          placeholder="Confirm Password"
          placeholderTextColor={"white"}
          value={confirmPass}
          onChangeText={(text) => setConfirmPass(text)}
          autoCapitalize={false}
        />
      </View>
      <TouchableOpacity style={{ marginVertical: 15 }} onPress={handleSignUp}>
        <Button title="Sign Up" bg="white" clr={COLORS.blue} />
      </TouchableOpacity>
      <Link text="Already have an account?" screen="Sign In" />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SignUp;
