import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase/firebaseConfig";
import { context } from "../../context/context";
import STYLES from "../../constants/styles";
import COLORS from "../../../assets/colors/colors";
import { Button, Loader } from "../../components/index";
const UserProfile = () => {
  const navigation = useNavigation();
  const { userName, userPhone, userImage, fetchUser, assistant } =
    useContext(context);
  const [loading, setLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [dpModalVisible, setDpModalVisible] = useState(false);
  const [newName, setNewName] = useState(null);
  const [newPhone, setNewPhone] = useState(null);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  let clr = COLORS.blue;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
    if (userPhone) {
      setPhone(userPhone);
    }
    if (userImage) {
      setImage(userImage);
    }
  }, [userImage, userName, userPhone]);

  const updateUser = async () => {
    if (newName && newPhone) {
      try {
        setDpModalVisible(false);
        setLoading(true);

        let userId = await AsyncStorage.getItem("uid");
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          name: newName,
          phone: newPhone,
        });
        setName(newName);
        alert("User details updated successfully!");
        setLoading(false);
        setDpModalVisible(false);
        setNewName(null);
        setNewPhone(null);
      } catch (error) {
        setLoading(false);
        setDpModalVisible(false);
        console.error("Error updating user: ", error);
        alert("Failed to update user details.");
      }
    } else {
      alert("All Fields are required ! ");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
      updateProfilePicture();
    }
  };

  const updateProfilePicture = async () => {
    setLoading(true);
    try {
      let userId = await AsyncStorage.getItem("uid");
      const fileName = newImage?.split("/").pop();
      const storageRef = ref(storage, `profilePicture/${userId}/${fileName}`);

      const response = await fetch(newImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const imageUrl = await getDownloadURL(storageRef);

      // Assuming you want to update the user's profile picture URL in their user document
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        profilePicture: imageUrl,
        updatedAt: new Date(),
      });
      // await setDoc(userDocRef, {
      //   profilePicture: imageUrl,
      //   updatedAt: new Date(),
      // });
      setLoading(false);
      alert("Profile picture updated successfully!");
      fetchUser();
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile picture: ", error);
      alert("Failed to update profile picture.");
    }
  };

  const handleSignout = async () => {
    auth
      .signOut()
      .then(() => {
        console.log("logged out !", auth.currentUser);
      })
      .catch((error) => alert(error.message));
  };

  // const updateAssistant = async (state) => {
  //   setIsToggled(!isToggled);
  //   try {
  //     const userId = await AsyncStorage.getItem("uid");
  //     const userDocRef = doc(collection(db, "users"), userId);
  //     // Toggle the assistant field
  //     await updateDoc(userDocRef, {
  //       assistant: state, // Toggle the current value of assistant
  //     });
  //     console.log("updated assistant value ");
  //   } catch (e) {
  //     console.log("error updateing assitant", e);
  //   }
  // };
  return (
    <View style={STYLES.container}>
      <View style={STYLES.card}>
        <View style={styles.nameRow}>
          <View
            style={{
              backgroundColor: COLORS.blue,
              padding: 5,
              borderRadius: 100,
            }}
          >
            <Image
              source={{ uri: image }}
              style={styles.profilepic}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.blue,
                position: "absolute",
                alignSelf: "flex-end",
                padding: 5,
                borderRadius: 50,
              }}
              onPress={pickImage}
            >
              <MaterialCommunityIcons
                name="pencil-circle-outline"
                size={30}
                color={"white"}
              />
            </TouchableOpacity>
          </View>
          <Text style={[STYLES.semiHeading, { textTransform: "uppercase" }]}>
            {name}
          </Text>
        </View>
        <View style={{ gap: 15 }}>
          {/* assistant */}
          {/* <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View
              style={[
                {
                  // justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                },
              ]}
            >
              <MaterialIcons
                name="keyboard-voice"
                size={24}
                color={clr}
                style={{}}
              />
              <Text style={STYLES.profileHeading}>Assistant</Text>
            </View>
            <View>
              {isToggled ? (
                <TouchableOpacity onPress={() => updateAssistant(false)}>
                  <FontAwesome name="toggle-on" size={28} color={clr} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => updateAssistant(true)}>
                  <FontAwesome name="toggle-off" size={28} color={clr} />
                </TouchableOpacity>
              )}
            </View>
          </View> */}

          {/* edit profile */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setDpModalVisible(true)}
          >
            <FontAwesome6 name="edit" size={20} color={clr} />
            <Text style={STYLES.profileHeading}>Edit Profile</Text>
          </TouchableOpacity>

          {/* logout */}
          <TouchableOpacity style={styles.row} onPress={handleSignout}>
            <MaterialIcons
              name="logout"
              size={24}
              color={COLORS.blue}
              style={{}}
            />
            <Text style={STYLES.profileHeading}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="none"
        visible={dpModalVisible}
        onRequestClose={() => {}} // Required for Android
      >
        <View
          style={{
            backgroundColor: COLORS.overlay,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              height: "30%",
              width: "90%",
              borderRadius: 10,
              alignItems: "center",
              // justifyContent: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setDpModalVisible(false)}
              style={{ alignSelf: "flex-end", marginBottom: 20 }}
            >
              <Entypo name="circle-with-cross" size={30} color={COLORS.blue} />
            </TouchableOpacity>
            <TextInput
              placeholder={name}
              value={newName}
              onChangeText={(text) => setNewName(text)}
              style={[
                STYLES.input,
                {
                  color: COLORS.blue,
                  borderWidth: 1,
                  borderColor: COLORS.blue,
                  borderRadius: 10,
                },
              ]}
            />
            <TextInput
              placeholder={phone}
              value={newPhone}
              onChangeText={(text) => setNewPhone(text)}
              keyboardType="number-pad"
              style={[
                STYLES.input,
                {
                  color: COLORS.blue,
                  borderWidth: 1,
                  borderColor: COLORS.blue,
                  borderRadius: 10,
                },
              ]}
            />

            <TouchableOpacity style={{ width: "100%" }} onPress={updateUser}>
              <Button title="Update" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  username: {
    fontSize: 16,
    fontWeight: "800",
  },
  profilepic: {
    height: 110,
    width: 110,
    borderRadius: 100,
  },
  nameRow: {
    // flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    gap: 10,
  },
});

export default UserProfile;
