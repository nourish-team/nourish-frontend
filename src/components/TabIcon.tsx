import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Animated } from "react-native";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";

type TabIconType = {
  focused: any;
  icon: string;
  IconComponent: string;
  size: number;
};

const TabIcon: React.FC<TabIconType> = ({
  focused,
  icon,
  IconComponent,
  size,
}) => {
  let Icon;

  switch (IconComponent) {
    case "MaterialCommunityIcons":
      Icon = MaterialCommunityIcons;
      break;

    case "FontAwesome":
      Icon = FontAwesome;
      break;

    case "Ionicons":
      Icon = Ionicons;
      break;

    case "FontAwesome5":
      Icon = FontAwesome5;
      break;

    case "Entypo":
      Icon = Entypo;
      break;

    default:
      break;
  }

  return (
    <View style={styles.container}>
      {Icon ? (
        <Icon
          name={icon}
          size={size}
          color={focused ? "white" : "white"}
          style={styles.icon}
        />
      ) : null}
      {focused ? <View style={styles.focusLine} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: 50,
  },
  icon: {
    width: 30,
    height: 30,
  },
  focusLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "white",
  },
});

export default TabIcon;
