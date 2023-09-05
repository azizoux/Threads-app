import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://172.20.10.4:3000/profile/${userId}`
      );
      if (response.status === 200) {
        const { user } = response.data;
        setUser(user);
      } else {
        console.log("error : ", response);
      }
    } catch (error) {
      console.log("error in fecth user ", error);
    }
  };
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.replace("Login");
  };
  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Treads.net</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={styles.image}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>BTch.</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Movie Buff | Musical Nerd
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Love Yourself
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {0} followers
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Edit Profile</Text>
          </Pressable>
          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifycontent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
});
