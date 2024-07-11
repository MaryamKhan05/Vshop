import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";

const Cart = () => {
  const [data, setData] = useState(null);



  useEffect(() => {
    const fetchItems = async () => {
      try {
        let userId = await AsyncStorage.getItem("uid");
        const itemsCollectionRef = collection(db, "cartItems");
        const q = query(itemsCollectionRef);

        const querySnapshot = await getDocs(q);
        let fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        console.log(fetchedItems);
        setData(fetchedItems);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchItems();
  }, []);

  const deleteItem = async (itemId) => {
    try {
      const itemDocRef = doc(db, "cartItems", itemId);
      await deleteDoc(itemDocRef);
      // Remove the item from the state after deletion
      setData(data.filter((item) => item.id !== itemId));
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
              style={[STYLES.semiHeading, { width: 200, textAlign: "left" }]}
            >
              {item.title}
            </Text>
            <Text style={[styles.caption, { width: 200 }]}>{item.caption}</Text>
            <Text style={styles.price}> Rs {item.price}</Text>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>
        <TouchableOpacity style={styles.delete} onPress={() => deleteItem(item.id)}>
          <MaterialIcons name="delete" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.totalAmountContainer}>
        <Text style={[styles.price, { color: "white" }]}>Rs. 999</Text>
        <TouchableOpacity style={styles.proceedBtn}>
          <Text style={[STYLES.semiHeading, { color: COLORS.blue }]}>
            Proceed
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 14,
    color: COLORS.disableBlack,
    margin: 3,
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    color: COLORS.blue,
  },
  delete: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  image: {
    height: 100,
    width: 100,
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
});

export default Cart;
