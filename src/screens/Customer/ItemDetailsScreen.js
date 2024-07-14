import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { context } from "../../context/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import Voice from "@react-native-voice/voice";

import { db } from "../../firebase/firebaseConfig";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button } from "../../components";

const ItemDetails = ({ route, navigation }) => {
  const [item, setItem] = useState(null);
  const { data } = useContext(context);
  const [started, setStarted] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  // const navigation = useNavigation();
  const { title, id } = route.params;

  useEffect(() => {
    if (id && data) {
      const selectedItem = data.find((item) => item.createdAt === id);
      setItem(selectedItem);
    }
  }, [id]);

  useEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const addToCart = async () => {
    try {
      let userId = await AsyncStorage.getItem("uid");

      const cartDocRef = collection(db, `users/${userId}/cartItems`);

      // Check if the item already exists in the cart
      const q = query(cartDocRef, where("createdAt", "==", item.createdAt));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("Item already exists in the cart!");
        return;
      }

      await addDoc(cartDocRef, {
        title: item.title,
        caption: item.caption,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt,
        userId: userId,
        category: item.category,
        price: item.price,
        id: item.id,
      });
      alert("Item added to cart!");
      navigation.navigate("My Cart");
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      alert("Failed to add item to cart.");
    }
  };

  useEffect(() => {
    if (recognizedText && recognizedText == "add to cart") {
      addToCart();
    }
  }, [recognizedText]);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const onSpeechError = (event) => {
    if (event) {
    }
  };
  const onSpeechResults = (event) => {
    if (event) {
      setRecognizedText(event?.value[0]);
      console.log(event?.value[0]);
    }
  };

  const startListening = async () => {
    try {
      setRecognizedText("");
      setStarted(true);
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[STYLES.container, {}]}>
      <Image
        source={{ uri: item?.imageUrl }}
        style={styles.image}
        resizeMode="stretch"
      />

      <Text style={[STYLES.semiHeading, styles.caption]}>{item?.title}</Text>
      <Text style={[STYLES.semiHeading, styles.caption]}>{item?.caption}</Text>
      <Text style={[STYLES.price, { paddingHorizontal: 5 }]}>
        Price: {item?.price}
      </Text>
      <TouchableOpacity style={styles.btn} onPress={addToCart}>
        <Button title="Add to Cart" />
      </TouchableOpacity>
      {started ? (
        <TouchableOpacity style={styles.recBtn} onPress={stopListening}>
          <Entypo name="dots-three-horizontal" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.recBtn} onPress={startListening}>
          <FontAwesome name="microphone" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: "45%",
    width: "98%",
    alignSelf: "center",
    borderRadius: 10,
  },
  caption: {
    textAlign: "left",
    marginVertical: 10,
  },
  btn: {
    justifyContent: "flex-end",
    flex: 1,
  },
  recBtn: {
    backgroundColor: COLORS.blue,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 60,
    height: 60,
    position: "absolute",
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: "flex-end",
    bottom: "12%",
    right: "10%",
  },
});

export default ItemDetails;
