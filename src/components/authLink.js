import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import STYLES from "../constants/styles";
import COLORS from "../../assets/colors/colors";
import { useNavigation } from "@react-navigation/native";

const Link = (props) => {
  const navigation = useNavigation();
  return (
    <View style={STYLES.linkRow}>
      <Text
        style={{ fontFamily: "PoppinsRegular", fontSize: 16, color: "white" }}
      >
        {props.text}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate(props.screen)}>
        <Text
          style={{ fontFamily: "PoppinsSemi", fontSize: 16, color: "white" }}
        >
          {props.screen}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Link;
