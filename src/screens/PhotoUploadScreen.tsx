import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UPLOAD_PRESET, CLOUD_NAME } from "@env";

export default function PhotoUploadScreen({
  image,
  setImage,
}: {
  image: string;
  setImage: (value: string) => void;
}) {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permision to access camera roll is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const base64Img = "data:image/jpeg;base64," + result.assets[0].base64;
        const uploadData = {
          file: base64Img,
          upload_preset: UPLOAD_PRESET,
        };

        try {
          fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
            method: "POST",
            body: JSON.stringify(uploadData),
            headers: {
              "content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((r) => {
              setImage(r.secure_url);
            });
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.text}>select image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Lato-Bold",
  },
});
