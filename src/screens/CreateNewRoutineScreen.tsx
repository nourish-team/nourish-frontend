import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import ItemsContext from "../contexts/ItemsContext";
import SearchToAddNewScreen from "./SearchToAddNewScreen";
import UserContext from "../contexts/UserContext";

type CreateNewRoutineRouteProp = RouteProp<
  RootStackParamList,
  "CreateNewRoutineScreen"
>;

type CreateNewRoutineNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateNewRoutineScreen"
>;

type Prop = {
  route: CreateNewRoutineRouteProp;
  navigation: CreateNewRoutineNavigationProp;
};

const CreateNewRoutineScreen: React.FC<Prop> = ({ route, navigation }) => {
  const { selectedItems } = route.params || { selectedItems: [] };
  const { userId } = useContext(UserContext);
  const [savedItems, setSavedItems] = useState<
    (number | { itemId: number; itemName: string })[]
  >([]);
  const [routineName, setRoutineName] = useState("");
  const skinTypeOptions = [
    "oily",
    "sensitive",
    "dry",
    "acne",
    "normal",
    "combination",
  ];
  const [selectedSkinType, setSelectedSkinType] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(false);
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setSavedItems((prevSavedItems) => [...prevSavedItems, ...selectedItems]);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (
      userId &&
      savedItems.length > 0 &&
      routineName &&
      selectedSkinType !== "" &&
      selectedSkinType
    ) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [routineName, selectedSkinType, savedItems]);

  const handleCancelButtonPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleAddProductsPress = () => {
    navigation.navigate("SearchToAddNewScreen");
  };

  const handlePublicToggle = () => {
    setIsPublic((prev) => !prev);
  };

  const handleCreateRoutine = async () => {
    if (createButtonDisabled) {
      alert("Some fields are missing! :(");
      return;
    }
    const routineProducts = savedItems.map((item) => {
      if (typeof item === "number") {
        return item;
      } else {
        return item.itemId;
      }
    });

    const routineData = {
      user_id: userId,
      routine_name: routineName,
      skin_type: selectedSkinType,
      routine_product: routineProducts,
      public: isPublic,
    };

    try {
      const response = await fetch("http://10.0.2.2:8080/routine/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routineData),
      });

      if (response.ok) {
        setError(false);
        navigation.navigate("HomeScreen");
        alert("Routine successfully created!");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const handleSkinTypeSelect = (skinType: string) => {
    setSelectedSkinType(skinType);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text>Oops, there was a problem making your routine</Text>
      ) : null}
      <Text style={styles.titleText}>Name your new routine!</Text>
      <TextInput
        style={styles.searchBox}
        value={routineName}
        onChangeText={(input) => setRoutineName(input)}
      />
      <Picker
        selectedValue={selectedSkinType}
        onValueChange={handleSkinTypeSelect}
        style={styles.picker}
      >
        <Picker.Item label="Select skin type" value={""} />
        {skinTypeOptions.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleAddProductsPress}
      >
        <Text style={styles.createButtonText}>Add Products</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateRoutine}
      >
        <Text style={styles.createButtonText}>Create new routine</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancelButtonPress}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <View style={styles.publicToggle}>
        <Text>Public:</Text>
        <Switch value={isPublic} onValueChange={handlePublicToggle} />
      </View>
      {savedItems && savedItems.length > 0 ? (
        savedItems.map((item, index) => (
          <Text key={index}>
            {typeof item === "number" ? item : item.itemName}
          </Text>
        ))
      ) : (
        <Text>No selected items</Text>
      )}
      <Text>User id is {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: "#FFFDD0",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
  },
  searchBox: {
    width: 300,
    height: 50,
    borderWidth: 3,
    borderColor: "rgba(1, 90, 131, 255)",
    marginBottom: 10,
    padding: 15,
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "PlayfairDisplay-Bold",
  },
  createButton: {
    width: 300,
    height: 50,
    backgroundColor: "rgba(1, 90, 131, 255)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  cancelButton: {
    width: 300,
    height: 50,
    backgroundColor: "white",
    borderColor: "rgba(1, 90, 131, 255)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "rgba(1, 90, 131, 255)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  titleText: {
    textAlign: "left",
    fontSize: 25,
    fontFamily: "PlayfairDisplay-Bold",
    color: "rgba(1,90,131,255)",
    marginBottom: 20,
    marginTop: -20,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "lightblue",
  },
  publicToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  picker: {
    width: 300,
    height: 50,
    borderWidth: 3,
    borderColor: "rgba(1, 90, 131, 255)",
    marginBottom: 10,
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "PlayfairDisplay-Bold",
  },
});

export default CreateNewRoutineScreen;
