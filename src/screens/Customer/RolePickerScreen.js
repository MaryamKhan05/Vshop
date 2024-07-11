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




