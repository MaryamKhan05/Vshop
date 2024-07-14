import { StyleSheet } from "react-native";
import COLORS from "../../assets/colors/colors";

const STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  heading: {
    fontSize: 28,
    textAlign: "center",
    padding: 10,
    fontFamily: "PoppinsBold",
    color: COLORS.blue,
  },
  semiHeading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    fontFamily: "PoppinsSemi",
  },
  profileHeading: {
    fontSize: 14,
    fontFamily: "PoppinsMedium",
  },
  textinputConatiner: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    gap: 10,
    marginVertical: 10,
  },
  input: {
    padding: 12,
    width: "90%",
    color: "white",
  },
  linkRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.blue,
    margin: 5,
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    color: COLORS.blue,
  },
});

export default STYLES;
