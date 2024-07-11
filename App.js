import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from 'react-native';
import { MyStack } from './src/navigation/StackNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsMedium: require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    PoppinsSemi: require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <MyStack/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
