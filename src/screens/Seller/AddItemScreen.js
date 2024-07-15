import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { doc, setDoc, addDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, storage } from "../../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button, Loader } from "../../components";

const AddItem = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [caption, setCaption] = useState(null);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);

  const DATA = [
    {
      id: 1,
      item: "Shoes",
    },
    {
      id: 2,
      item: "Bag",
    },
  ];
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveItem = async () => {
    if (title && caption && image && price && category) {
      setLoading(true);
      try {
        let userId = await AsyncStorage.getItem("uid");
        const fileName = image.split("/").pop();
        const storageRef = ref(storage, `items/${userId}/${fileName}`);

        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);

        const imageUrl = await getDownloadURL(storageRef);

        const itemDocRef = collection(db, "items");
        await addDoc(itemDocRef, {
          title: title,
          caption: caption,
          imageUrl: imageUrl,
          createdAt: new Date(),
          userId: userId,
          category: category,
          price: price,
        });
        setLoading(false);
        alert("Item saved!");
        setTitle(null);
        setCaption(null);
        setImage(null);
        setCategory(null);
        setPrice(null);
      } catch (error) {
        setLoading(false);
        console.error("Error saving item: ", error);
        alert("Failed to save item.");
      }
    } else {
      setLoading(false);
      alert("Please fill in all fields and select an image.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => [setCategory(item.item), setCategoryModal(false)]}
      >
        <Text style={styles.listItem}>{item.item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <KeyboardAvoidingView
      style={STYLES.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enableOnAndroid={true}
      >
        <Text style={[STYLES.semiHeading]}>What You want to Sell Today? </Text>
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ height: 150, width: 150 }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.iconContainer}>
              <Entypo name="plus" size={50} color={COLORS.blue} style={{}} />
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Item Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          style={[STYLES.input, styles.Input]}
        />
        <TextInput
          placeholder="Detail"
          value={caption}
          onChangeText={(text) => setCaption(text)}
          style={[STYLES.input, styles.Input]}
        />
        <TouchableOpacity onPress={() => setCategoryModal(true)}>
          <TextInput
            placeholder="Category"
            value={category}
            onFocus={() => setCategoryModal(true)}
            style={[STYLES.input, styles.Input]}
            editable={false}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          style={[STYLES.input, styles.Input]}
        />
      </KeyboardAwareScrollView>
      <TouchableOpacity style={{}} onPress={saveItem}>
        <Button title="Save" />
      </TouchableOpacity>
      {loading && <Loader />}

      {/* category modal */}
      <Modal
        transparent={true}
        animationType="none"
        visible={categoryModal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <TouchableOpacity
              onPress={() => setCategoryModal(false)}
              style={styles.crossBtn}
            >
              <Entypo name="cross" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <FlatList
              data={DATA}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: COLORS.lightgrey,
    height: 150,
    width: 150,
    alignItems: "center",
    alignSelf: "center",
    margin: "10%",
    borderRadius: 10,
  },
  Input: {
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 10,
    alignSelf: "center",
    color: COLORS.black,
    fontFamily: "PoppinsRegular",
    marginVertical: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
  },
  activityIndicatorWrapper: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    padding: 10,
    height: "40%",
  },
  crossBtn: {
    padding: 5,
    alignSelf: "flex-end",
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    marginVertical: 10,
  },
  listItem: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "PoppinsRegular",
    margin: 10,
  },
});

export default AddItem;
