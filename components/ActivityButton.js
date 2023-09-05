import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const ActivityButton = ({ btnName, selectedButton, setSelectedButton }) => {
  const handleClicked = (text) => {
    setSelectedButton(text);
  };
  return (
    <TouchableOpacity
      onPress={() => handleClicked(btnName)}
      style={[
        styles.btn,
        selectedButton === btnName ? { backgroundColor: "black" } : null,
      ]}
    >
      <Text
        style={[
          styles.text,
          selectedButton === btnName ? { color: "white" } : { color: "black" },
        ]}
      >
        {btnName}
      </Text>
    </TouchableOpacity>
  );
};

export default ActivityButton;

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderColor: "#D0D0D0",
    borderRadius: 6,
    borderWidth: 0.7,
  },
  text: { textAlign: "center", fontWeight: "bold" },
});
