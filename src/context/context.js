import React, { createContext, useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase/firebaseConfig";

const context = createContext();

const Provider = ({ children }) => {
  const [bData, setBagsData] = useState([]);
  const [sData, setShoesData] = useState([]);
  const [oData, setOtherData] = useState([]);
  const [data, setData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [userName, setUsername] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [assistant, setAssistant] = useState(null);

  //   function to fetch all the items on customer dashboard
  const fetchItems = async () => {
    try {
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
      for (let i = 0; i < fetchedItems.length; i++) {
        // Changed <= to < to avoid out-of-bounds error
        if (
          fetchedItems[i]?.category === "Bag" ||
          fetchedItems[i]?.category === "bag"
        ) {
          bagArray.push(fetchedItems[i]);
        } else if (
          fetchedItems[i]?.category === "Shoes" ||
          fetchedItems[i]?.category === "shoes"
        ) {
          shoesArray.push(fetchedItems[i]);
        } else {
          othersArray.push(fetchedItems[i]);
        }
      }
      setBagsData(bagArray);
      setShoesData(shoesArray);
      setOtherData(othersArray);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCartItems();
  }, []);

  //function to fetch cart items
  const fetchCartItems = async () => {
    try {
      let userId = await AsyncStorage.getItem("uid");
      const itemsCollectionRef = collection(db, `users/${userId}/cartItems`);
      const q = query(itemsCollectionRef);

      const querySnapshot = await getDocs(q);
      let fetchedItems = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() });
      });
      setCartData(fetchedItems);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  //function to fetch user details
  const fetchUser = async () => {
    try {
      let userId = await AsyncStorage.getItem("uid");
      const userDocRef = doc(collection(db, "users"), userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData?.name);
        setUserPhone(userData?.phone);
        setUserImage(userData?.profilePicture);
        setAssistant(userData?.assistant);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
  };

  return (
    <context.Provider
      value={{
        bData,
        sData,
        oData,
        data,
        fetchItems,
        fetchCartItems,
        cartData,
        fetchUser,
        userImage,
        userPhone,
        userName,
        assistant
      }}
    >
      {children}
    </context.Provider>
  );
};

export { Provider, context };
