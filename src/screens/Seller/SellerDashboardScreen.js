import React, { useState, useEffect } from "react";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button } from "../../components/index";

const SellerDashboard = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(null);
  const [data, setData] = useState(null);
  const [shoesData, setShoesData] = useState(null);
  const [bagsData, setBagsData] = useState(null);
  const [otherData, setOtherData] = useState(null);

  const fetchItems = async () => {
    try {
      let userId = await AsyncStorage.getItem("uid");
      const itemsCollectionRef = collection(db, "items");
      const q = query(itemsCollectionRef);

      const querySnapshot = await getDocs(q);
      let fetchedItems = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() });
      });
      setData(fetchedItems);
      let bagArray = [];
      let shoesArray = [];
      let othersArray = [];
      for (let i = 0; i <= fetchedItems?.length; i++) {
        if (fetchedItems[i]?.userId == userId) {
          if (
            fetchedItems[i]?.category == "Bag" ||
            fetchedItems[i]?.category == "bag"
          ) {
            bagArray.push(fetchedItems[i]);
          } else if (
            fetchedItems[i]?.category == "Shoes" ||
            fetchedItems[i]?.category == "shoes"
          ) {
            shoesArray.push(fetchedItems[i]);
          } else {
            othersArray.push(fetchedItems[i]);
          }
          setBagsData(bagArray);
          setShoesData(shoesArray);
          setOtherData(othersArray);
        }
      }
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };
  useEffect(() => {}, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchItems();
    });

    return unsubscribe;
  }, [navigation]);

  const deleteItem = async (createdAt) => {

      try {
        let userId = await AsyncStorage.getItem("uid");
        const itemRef = collection(
          db,
          `items`
        );
  
        // Query to find the document with the matching createdAt
        const q = query(
          itemRef,
          where("createdAt", "==", createdAt)
        );
        const querySnapshot = await getDocs(q);
  
        // Loop through the query results and delete each document
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        alert("item deteled successfully !");
        fetchItems();
      } catch (error) {
        console.error("Error deleting item: ", error);
      }
    
  };

  const shoesRenderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteItem(item.createdAt)}
        >
          <MaterialCommunityIcons
            name="delete-circle"
            size={34}
            color="white"
          />
        </TouchableOpacity>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        <Text style={STYLES.profileHeading}>{item.title}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
      </View>
    );
  };
  const bagsRenderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteItem(item.createdAt)}
        >
          <MaterialCommunityIcons
            name="delete-circle"
            size={34}
            color="white"
          />
        </TouchableOpacity>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={STYLES.profileHeading}>{item.title}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={STYLES.container}>
      <Text style={STYLES.heading}>A Fresh Approach To The Selling ! </Text>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Add New Item")}
      >
        <Button title="Add Item" />
      </TouchableOpacity>
      {data ? (
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
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={STYLES.semiHeading}>No items to show !</Text>
        </View>
      )}
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
  },
  price: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: COLORS.blue,
  },
  card: {
    backgroundColor: COLORS.white,
    // height: "35%",
    borderRadius: 20,
    // alignItems: "flex-end",
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.blue,
    margin: 5,
  },
  profilepic: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: "red",
    alignSelf: "flex-end",
  },
  addBtn: {
    position: "absolute",
    bottom: "5%",
    zIndex: 1,
    alignSelf: "center",
    width: "100%",
  },
  deleteBtn: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "red",
    borderRadius: 50,
    padding: 2,
    zIndex: 1,
  },
});

export default SellerDashboard;
