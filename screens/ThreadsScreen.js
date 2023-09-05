import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useContext } from "react";
import axios from "axios";

import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const handlePostSubmit = async () => {
    const postData = {
      userId,
    };
    if (content) {
      postData.content = content;
    }
    try {
      const response = await axios.post(
        "http://172.20.10.4:3000/create-post",
        postData
      );
      console.log("response: ", response.status);
      if (response.status === 200) {
        setContent("");
        console.log(response.data.message);
        // navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={styles.image}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>Abdelaziz</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="Type your message..."
          placeholderTextColor={"black"}
          multiline
        />
      </View>
      <View style={{ marginTop: 20 }} />
      <View>
        <Button onPress={handlePostSubmit} title="Share Post" />
        <Button onPress={() => navigation.goBack()} title="Retour" />
      </View>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  btn: {},
});
