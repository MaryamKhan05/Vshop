import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { context } from "../../context/context";
import Voice from "@react-native-voice/voice";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();
  const { bData, sData, oData, data, fetchItems, fetchUser, assistant } =
    useContext(context);
  const [search, setSearch] = useState(null);
  const [shoesData, setShoesData] = useState(null);
  const [bagsData, setBagsData] = useState(null);
  const [otherData, setOtherData] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (bData) {
      setBagsData(bData);
    }
    if (sData) {
      setShoesData(sData);
    }
    if (oData) {
      setOtherData(oData);
    }
  }, [bData, sData, oData]);

  const onSpeechError = (event) => {
    if (event) {
    }
  };
  const onSpeechResults = (event) => {
    if (event) {
      setSearch(event?.value[0]);
      console.log(event?.value[0]);
    }
  };

  const startListening = async () => {
    try {
      setSearch("");
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

  const emptySearchBar = () => {
    setSearch(null);
    fetchItems();
  };

  useEffect(() => {
    if (search) {
      filterItems(data);
    }
  }, [search]);

  const filterItems = (items) => {
    console.log(items, "item");
    const filteredItems = items?.filter((item) =>
      // item?.title?.toLowerCase().includes(search?.toLowerCase()) ||
      item?.category?.toLowerCase().includes(search?.toLowerCase())
    );
    let bagArray = [];
    let shoesArray = [];
    let othersArray = [];
    filteredItems?.forEach((item) => {
      if (item?.category?.toLowerCase() === "bag") {
        console.log(item, "bag category items");
        bagArray.push(item);
      } else if (item?.category?.toLowerCase() === "shoes") {
        shoesArray?.push(item);
      } else {
        othersArray?.push(item);
      }
    });
    setBagsData(bagArray);
    setShoesData(shoesArray);
    setOtherData(othersArray);
  };

  const shoesRenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[STYLES.card, { gap: 1 }]}
        onPress={() =>
          navigation.navigate("ItemDetails", {
            title: item.title,
            id: item.createdAt,
          })
        }
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[STYLES.profileHeading, { width: 123 }]}>
          {item.title}
        </Text>
        <Text
          style={[
            STYLES.placeholder,
            {
              width: 140,
              fontSize: 14,
            },
          ]}
          numberOfLines={1}
        >
          {item.caption}
        </Text>

        <Text style={styles.price}>Rs {item.price}</Text>
      </TouchableOpacity>
    );
  };
  const bagsRenderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[STYLES.card, { gap: 1 }]}
        onPress={() =>
          navigation.navigate("ItemDetails", {
            title: item.title,
            id: item.createdAt,
          })
        }
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[STYLES.profileHeading, { width: 123 }]}>
          {item.title}
        </Text>
        <Text
          style={[STYLES.placeholder, { width: 140, fontSize: 14 }]}
          numberOfLines={1}
        >
          {item.caption}
        </Text>
        <Text style={styles.price}>Rs {item.price}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={STYLES.container}>
      {/* <TouchableOpacity>
        <Image
          source={require("../../assets/profilepic.jpg")}
          style={styles.profilepic}
          resizeMode="cover"
        />
      </TouchableOpacity> */}
      <Text style={STYLES.heading}>A Fresh Approach To The Shopping ! </Text>
      {/* searchbar */}
      <View style={styles.barRow}>
        <TextInput
          placeholder="Search Anything !"
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={styles.searchbar}
        />
        {/* <FontAwesome5 name="search" size={20} color={COLORS.placeholder} /> */}

        {search ? (
          <TouchableOpacity onPress={emptySearchBar}>
            <Entypo name="cross" size={24} color={"black"} />
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* categories */}
        <Text style={[STYLES.semiHeading, { textAlign: "left", top: 10 }]}>
          Categories
        </Text>
        {/* shoes list */}
        {shoesData && (
          <View>
            <Text
              style={[
                STYLES.semiHeading,
                { textAlign: "left", top: 10, marginVertical: 10 },
              ]}
            >
              Shoes
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={shoesData}
              keyExtractor={(item) => item.id}
              renderItem={shoesRenderItem}
            />
          </View>
        )}

        {/* bags list  */}
        {bagsData && (
          <View>
            <Text
              style={[
                STYLES.semiHeading,
                { textAlign: "left", top: 10, marginVertical: 10 },
              ]}
            >
              Bags
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={bagsData}
              keyExtractor={(item) => item.id}
              renderItem={bagsRenderItem}
            />
          </View>
        )}
      </ScrollView>
      {started ? (
        <TouchableOpacity style={styles.recBtn} onPress={stopListening}>
          <Entypo name="dots-three-horizontal" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.recBtn} onPress={startListening}>
          <FontAwesome name="microphone" size={24} color="white" />
        </TouchableOpacity>
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bar: {
    padding: 10,
  },
  barRow: {
    backgroundColor: COLORS.lightgrey,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  searchbar: {
    padding: 10,
    width: "90%",
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    marginVertical: 5,
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: COLORS.blue,
    // top: 5,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.disableGrey,
    margin: 5,
  },
  profilepic: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: "red",
    alignSelf: "flex-end",
  },
  cartBtn: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 15,
  },
  recBtn: {
    backgroundColor: COLORS.blue,
    padding: 10,
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
    bottom: "5%",
    right: "10%",
  },
});

export default Dashboard;
