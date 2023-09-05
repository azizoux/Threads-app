import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useContext, useEffect, useCallback } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import Post from "../components/Post";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodeToken = jwt_decode(token);
    const userId = decodeToken.userId;
    setUserId(userId);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://172.20.10.4:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Image
          style={{
            width: 60,
            height: 40,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        {posts?.map((item, index) => (
          <Post key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
});
