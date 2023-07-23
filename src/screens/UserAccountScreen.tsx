import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { signOut, getAuth, deleteUser } from "firebase/auth";

const UserAccountScreen: React.FC = () => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const auth = getAuth();

  const handleAccountLogout = async () => {
    try {
      await signOut(auth);
      alert("You have successfully signed out");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        alert("You have successfully deleted your account");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    await handleAccountDeletion();
    alert("You have successfully deleted your account");
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/blue-curtain.png")}
          style={styles.image}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Settings</Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={handleAccountLogout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowConfirmDelete(true)}
      >
        <Text style={styles.text}>Delete Account</Text>
      </TouchableOpacity>
      <Modal visible={showConfirmDelete} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you absolutely sure you want to delete your account? We'll miss
            having you as part of our community.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmDelete}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCancelDelete}
            >
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
  },
  modalText: {
    fontFamily: "Lato-Bold",
    fontSize: 30,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "rgba(1,90,131,255)",
    padding: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    height: Dimensions.get("window").height * 0.15,
    width: Dimensions.get("window").width,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 40,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    color: "white",
    letterSpacing: 1.5,
    marginBottom: 30,
    marginTop: Dimensions.get("window").height * 0.06,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 50,
    backgroundColor: "#EEE3CB",
    marginBottom: 30,
    height: 80,
    width: 200,
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default UserAccountScreen;
