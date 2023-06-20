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
  const [description, setDescription] = useState("");
  const weatherTypeOptions = [
    "hot air",
    "dry air",
    "humid air",
  ];
  const [weatherType, setWeatherType] = useState<string>("");

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
      selectedSkinType &&
      weatherType !== "" &&
      weatherType
    ) {
      setCreateButtonDisabled(false);
    } else {
      setCreateButtonDisabled(true);
    }
  }, [routineName, selectedSkinType, savedItems, weatherType]);

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
      weather_type: weatherType,
      description: description,
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

  const handleWeatherTypeSelect = (weatherType: string) => {
    setWeatherType(weatherType);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text>Oops, there was a problem making your routine</Text>
      ) : null}
      <View style={styles.headButtonContainer}>
        <TouchableOpacity
          style={styles.createRoutineButton}
          onPress={handleCreateRoutine}
          >
            <Text style={styles.createRoutineButtonText}>Create New{"\n"}Routine</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelButtonPress}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity> 
      </View>
      <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
      <View style={styles.newNameContainer}>
        <View style={styles.nameContainer}>
        <Text style={styles.titleNameText}>Name your{"\n"}new routine!</Text>
        </View>
        <TextInput
        style={styles.searchBox}
        value={routineName}
        onChangeText={(input) => setRoutineName(input)}
        />
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.selectContainer}>
          <Picker
          selectedValue={selectedSkinType}
          onValueChange={handleSkinTypeSelect}
          style={styles.picker}
          >
            <Picker.Item
            value={""}
            label="Select skin type"
            style={styles.pickerItemLabel}
            />
            {skinTypeOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
        <View style={styles.selectContainer}>
          <Picker
          selectedValue={weatherType}
          onValueChange={handleWeatherTypeSelect}
          style={styles.picker}
          >
            <Picker.Item 
            value={""} 
            label="Select weather type"
            style={styles.pickerItemLabel}
            />
            {weatherTypeOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>
      <TouchableOpacity
        style={styles.createProductButton}
        onPress={handleAddProductsPress}
      >
        <Text style={styles.createProductButtonText}>Add Products</Text>
      </TouchableOpacity>
      <View style={styles.descriptionContainerTop}>
        <Text style={styles.descriptionTitleText}>Description</Text>
        <View style={styles.publicToggle}>
          <Text>Public:</Text>
          <Switch value={isPublic} onValueChange={handlePublicToggle} />
        </View>
      </View>
      <View style={styles.descriptionContainer}>
          <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description your routine"
          multiline
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  headButtonContainer: {
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "rgb(239, 245, 147)",
  },
  createRoutineButton: {
    width: "48%",
    height: 50,
    backgroundColor: "rgba(1, 90, 131, 255)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 25,
  },
  createRoutineButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  buttonSpacer: {
    width: 20, 
  },
  cancelButton: {
    width: "48%",
    height: 50,
    backgroundColor: "rgba(211, 211, 211, 255)",
    borderColor: "rgba(1, 90, 131, 255)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "rgba(1, 90, 131, 255)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  separator: {
    color: "rgba(1, 90, 131, 255)",
    fontSize: 15,
    textAlign: "center",
  },
  newNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight:20,
    paddingLeft:20,
    marginTop: 20,
    marginBottom: 20,
  },
  nameContainer: {
    backgroundColor: "rgb(80, 122, 145)",
    borderRadius: 10,
    padding: 10,
    textAlign: "center"
  },
  titleNameText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Lato-Bold",
  },
  searchBox: {
    flex: 1,
    height: 50,
    borderWidth: 3,
    borderColor: "rgba(1, 90, 131, 255)",
    marginLeft: 10,
    padding: 15,
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "PlayfairDisplay-Bold",
  },
  pickerContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    paddingRight: 10,
    paddingLeft: 10,
    height: 60,
  },
  selectContainer: {
    flex: 1,
    marginRight: 5,
    borderWidth: 3,
    borderColor: "rgba(1, 90, 131, 255)",
    borderRadius: 5,
    backgroundColor: "#EEE3CB",
  },
  picker: {
    flex: 1,
    height: 40,
    fontFamily: "PlayfairDisplay-Bold",
  },
  pickerItemLabel: {
    fontSize: 11, 
    fontWeight:"bold",
    fontFamily: "Lato-Bold",
  },
  createProductButton: {
    width: 300,
    height: 50,
    backgroundColor: "rgb(80, 122, 145)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingRight:10,
    paddingLeft:10,
    marginTop: 20,
    marginBottom: 20,
  },
  createProductButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  descriptionContainerTop: {
    width: 350,
    height: 40,
    borderColor: "rgba(1, 90, 131, 255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    backgroundColor: "#EEE3CB",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  descriptionContainer: {
    width: 350,
    height: 200,
    backgroundColor: "white",
    padding: 10,
    borderColor: "rgba(1, 90, 131, 255)",
    borderWidth: 3,
    textAlignVertical: "top",
    textAlign: "left",
    marginBottom: 10,
  },
  descriptionTitleContainer: {
    flex: 7,
    paddingLeft: 10,
    borderRightColor:  "rgba(1, 90, 131, 255)",
    borderWidth: 3,
  },
  descriptionTitleText: {
    fontFamily: "Lato-Bold",
    padding: 10,
    color: "black",
    fontSize: 15,
  },
  publicToggle: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
    textAlign: "center",
  },
});

export default CreateNewRoutineScreen;
