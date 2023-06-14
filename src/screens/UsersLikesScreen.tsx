import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UsersLikesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Test Likes Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#FFFDD0",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default UsersLikesScreen;
