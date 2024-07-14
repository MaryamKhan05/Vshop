import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import STYLES from "../../constants/styles";
import { Button } from "../../components/index";
import { useNavigation } from "@react-navigation/native";

const RolePickerScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={[STYLES.container, { justifyContent: "center" }]}>
      <Text style={STYLES.heading}>Welcome to Our Shop</Text>
      <Text style={STYLES.semiHeading}>Best Products Just for You! </Text>
      <Image
        source={require("../../../assets/cart2.jpeg")}
        style={styles.image}
      />
      <Text style={STYLES.semiHeading}>What you want to do today ? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("SellerDashboard")}>
        <Button title="Sell" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("MyTab")}>
        <Button title="Buy" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
    alignSelf: "center",
    marginVertical: 25,
  },
});

export default RolePickerScreen;

// import React, { useState, useEffect } from "react";
// import { View, Button, TextInput, StyleSheet } from "react-native";
// import Voice from "@react-native-voice/voice";

// const RolePickerScreen = () => {
//   const [recognizedText, setRecognizedText] = useState("");
//   const [started, setStarted] = useState(false);

//   useEffect(() => {
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechError = (event) => {
//     setRecognizedText(event.value[0]);
//   };
//   const onSpeechResults = (event) => {
//     setRecognizedText(event.value[0]);
//     console.log(event.value[0]);
//   };

//   const startListening = async () => {
//     try {
//       setRecognizedText("");
//       setStarted(true);
//       await Voice.start("en-US");
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//       setStarted(false);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Search..."
//         value={recognizedText}
//         onChangeText={setRecognizedText}
//       />
//       {started ? (
//         <Button title="Stop Voice Assistant" onPress={stopListening} />
//       ) : (
//         <Button title="Start Voice Assistant" onPress={startListening} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   input: {
//     width: "80%",
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
// });

// export default RolePickerScreen;
