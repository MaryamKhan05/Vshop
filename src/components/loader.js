import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";
import COLORS from "../../assets/colors/colors";

const Loader = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={true}
      onRequestClose={() => {}} // Required for Android
    >
      <View style={styles.modalBackground}>
        {/* <View style={styles.activityIndicatorWrapper}> */}
          <ActivityIndicator size="large" color={COLORS.blue} />
        {/* </View> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.white,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
