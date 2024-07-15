import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { context } from "../../context/context";
import { Button } from "../../components/index";
import { useNavigation } from "@react-navigation/native";

const Payment = ({ route }) => {
  const navigation = useNavigation();
  const { userName, userPhone, fetchCartItems, cartData, fetchUser } =
    useContext(context);
  const [address, setAddress] = useState(null);
  const [number, setNumber] = useState(userPhone);
  const [name, setName] = useState(userName);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (route?.params) {
      let dataArray = [route?.params];
      console.log(route?.params);
      setData(dataArray);
    } else if (cartData) {
      setData(cartData);
    }
  }, [cartData, route?.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCartItems();
      fetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ alignItems: "left" }}>
            <Text style={[styles.title, { width: 120, textAlign: "left" }]}>
              {item.title}
            </Text>
            <Text style={[styles.caption, { width: 150 }]}>{item.caption}</Text>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>
      </View>
    );
  };
  return (
    <View style={STYLES.container}>
      {/* item details card */}

      <Text style={styles.title}>Item(s) Details</Text>
      <View style={STYLES.card}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
      <Text style={styles.title}>Name</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <Text style={styles.title}>Contact Number</Text>
      <TextInput
        value={number}
        onChangeText={(text) => setNumber(text)}
        style={styles.input}
      />
      <Text style={styles.title}>Billing Address </Text>
      <TextInput
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
      />
      <Text style={styles.title}>Payment Method</Text>
      <View style={styles.row}>
        <TouchableOpacity>
          <Fontisto name="radio-btn-active" size={20} color={COLORS.blue} />
        </TouchableOpacity>
        <Text style={{ fontFamily: "PoppinsRegular", fontSize: 12 }}>
          Cash On Delivery
        </Text>
      </View>

      <TouchableOpacity style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button title="Confirm Order" />
      </TouchableOpacity>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    padding: 5,
    width: "95%",
    borderRadius: 8,
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    marginBottom: 10,
    // alignSelf: "center",
  },
  title: {
    fontFamily: "PoppinsSemi",
    fontSize: 14,
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
  caption: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: COLORS.disableBlack,
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
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
});

export default Payment;
