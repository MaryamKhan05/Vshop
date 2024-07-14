import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase/firebaseConfig";
import STYLES from "../../constants/styles";
import { context } from "../../context/context";
import COLORS from "../../../assets/colors/colors";

const Cart = () => {
  const navigation = useNavigation();
  const { fetchCartItems, cartData } = useContext(context);
  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (cartData) {
      setData(cartData);
      calculateTotalPrice(cartData);
    }
  }, [cartData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCartItems();
    });

    return unsubscribe;
  }, [navigation]);

  const calculateTotalPrice = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += parseFloat(item.price);
    });
    setTotalPrice(total);
  };
  const deleteItem = async (createdAt) => {
    try {
      let userId = await AsyncStorage.getItem("uid");
      const cartItemsCollectionRef = collection(
        db,
        `users/${userId}/cartItems`
      );

      // Query to find the document with the matching createdAt
      const q = query(
        cartItemsCollectionRef,
        where("createdAt", "==", createdAt)
      );
      const querySnapshot = await getDocs(q);

      // Loop through the query results and delete each document
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      alert("item deteled successfully !");
      fetchCartItems();
      setData(cartData);
      calculateTotalPrice(cartData);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={STYLES.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ alignItems: "left" }}>
            <Text
              style={[styles.semiHeading, { width: 200, textAlign: "left" }]}
            >
              {item.title}
            </Text>
            <Text style={[styles.caption, { width: 200 }]}>{item.caption}</Text>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>
        <TouchableOpacity
          style={styles.delete}
          onPress={() => deleteItem(item.createdAt)}
        >
          <MaterialIcons name="delete" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.totalAmountContainer}>
        {/* i want to show the total price of items here */}
        <Text style={[styles.price, { color: "white" }]}>Rs. {totalPrice}</Text>
        {totalPrice ? (
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={() => navigation.navigate("Payment")}
          >
            <Text style={[STYLES.semiHeading, { color: COLORS.blue }]}>
              Proceed
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.disableGrey,
    margin: 5,
  },
  caption: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: COLORS.disableBlack,
    // margin: 1,
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: COLORS.blue,
  },
  delete: {
    backgroundColor: COLORS.blue,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 15,
  },
  totalAmountContainer: {
    backgroundColor: COLORS.blue,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proceedBtn: {
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    width: 120,
  },
  semiHeading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    // padding: 5,
    fontFamily: "PoppinsSemi",
  },
});

export default Cart;
