import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "../../assets/colors/colors";

const Button = (props) => {
  return (
    <View
      style={[
        styles.btn,
        {
          backgroundColor: props?.bg ? props?.bg : COLORS.blue,
          width: props.wid ? props.wid : "90%",
        },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          { color: props.clr ? props.clr : COLORS.white },
        ]}
      >
        {props.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    borderRadius: 10,

    alignSelf: "center",
    margin: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "condensedBold",
    textAlign: "center",
    fontFamily: "PoppinsSemi",
  },
});

export default Button;
