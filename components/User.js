import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [btnText, setBtnText] = useState("follow");
  useEffect(() => {
    item?.followers?.includes(userId)
      ? setBtnText("unfollow")
      : setBtnText("follow");
  }, []);
  const toggleFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await axios.post(`http://172.20.10.4:3000/${btnText}`, {
        currentUserId,
        selectedUserId,
      });
      if (response.status === 200) {
        console.log(response.data.message);
        setBtnText(btnText === "follow" ? "unfollow" : "follow");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={styles.name}>{item?.name}</Text>
        <Pressable
          style={[
            styles.btn,
            { backgroundColor: btnText === "follow" ? "lightblue" : null },
          ]}
          onPress={() => toggleFollow(userId, item._id)}
        >
          <Text style={styles.text}>
            {btnText === "follow" ? "Suivi" : "Suivre"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  btn: {
    borderColor: "#D0D0D0",
    borderWidth: 1,
    padding: 10,

    width: 100,
    borderRadius: 7,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});
