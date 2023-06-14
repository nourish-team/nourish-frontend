import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
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
      <TouchableOpacity onPress={handleAccountLogout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowConfirmDelete(true)}>
        <Text style={styles.text}>Delete Account</Text>
      </TouchableOpacity>
      <Modal visible={showConfirmDelete} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalContent}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default UserAccountScreen;
