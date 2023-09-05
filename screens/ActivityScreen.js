import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ActivityButton from "../components/ActivityButton";
import User from "../components/User";

import { UserType } from "../UserContext";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("People");
  const [content, setContent] = useState("People Content");
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodeToken = jwt_decode(token);
    const userId = decodeToken.userId;
    setUserId(userId);
    await axios
      .get(`http://172.20.10.4:3000/users/${userId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log("error retrieving users", error);
      });
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={styles.title}>ActivityScreen</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 12,
          }}
        >
          <ActivityButton
            btnName={"People"}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
          />
          <ActivityButton
            btnName={"All"}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
          />
          <ActivityButton
            btnName={"Request"}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
          />
        </View>
        <View>
          {selectedButton === "People" && (
            <View style={{ marginTop: 20 }}>
              {users?.map((item, index) => (
                <User key={index} item={item} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
