import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";

import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import axios from "axios";

const Post = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const toggleLikes = async (postId, link) => {
    try {
      const response = await axios.put(
        `http://172.20.10.4:3000/post-${link}/${postId}/${userId}`
      );
      if (response.status === 200) {
        console.log("post handleLike");
      }
    } catch (error) {
      console.log("error in liking: ", error);
    }
  };
  return (
    <View
      style={{
        padding: 15,
        borderColor: "#D0D0D0",
        borderTopWidth: 1,
        flexDirection: "row",
        marginVertical: 10,
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
      <View style>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}>
          {item?.user?.name}
        </Text>
        <Text style={{ marginRight: 10 }}>{item?.content}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 15,
          }}
        >
          {item.likes.includes(userId) ? (
            <AntDesign
              onPress={() => toggleLikes(item._id, "unlike")}
              name="heart"
              size={24}
              color="red"
            />
          ) : (
            <AntDesign
              onPress={() => toggleLikes(item._id, "like")}
              name="hearto"
              size={24}
              color="black"
            />
          )}

          <FontAwesome name="comment-o" size={24} color="black" />
          <Ionicons name="share-social-outline" size={24} color="black" />
        </View>
        <Text style={{ marginTop: 7, color: "gray" }}>
          {item?.likes?.length} likes, {item?.replies?.length} reply
        </Text>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({});
