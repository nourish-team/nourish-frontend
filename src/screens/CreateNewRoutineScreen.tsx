import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
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
  const weatherTypeOptions = ["hot air", "dry air", "humid air"];
  const [weatherType, setWeatherType] = useState<string>("");

  useEffect(() => {
    console.log("Selected items at the start of useEffect:", selectedItems);
    if (selectedItems && selectedItems.length > 0) {
      console.log("trying to clear the items");
      setSavedItems((prevSavedItems) => {
        const uniqueItems = new Set([...prevSavedItems, ...selectedItems]);
        return Array.from(uniqueItems);
      });
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
    navigation.navigate("SearchToAddNewScreen", { selectedItems: savedItems });
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
      const response = await fetch(
        "https://nourishskin.herokuapp.com/routine/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(routineData),
        }
      );

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
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.tabTop}>
          <Text style={styles.tabText}>new routine</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createRoutineButton}
          onPress={handleCreateRoutine}
        >
          <Text style={styles.createRoutineButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelButtonPress}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {error ? (
          <Text>Oops, there was a problem making your routine</Text>
        ) : null}
        <View style={styles.newNameContainer}>
          <Text style={styles.titleNameText}>Name</Text>
          <TextInput
            style={styles.searchBox}
            value={routineName}
            onChangeText={(input) => setRoutineName(input)}
          />
        </View>
        <View style={styles.descriptionParentContainer}>
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
              placeholder="Describe your routine here... Max 300 char"
              multiline
            />
          </View>
        </View>
        <View style={styles.selectContainer}>
          <View style={styles.selectContainerLeft}>
            <Text style={styles.titleNameText}>Skin Type</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {skinTypeOptions.map((option, index) => (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedSkinType === option && styles.selectedOption,
                ]}
                key={index}
                onPress={() => handleSkinTypeSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.selectContainer}>
          <View style={styles.selectContainerLeft}>
            <Text style={styles.titleNameText}>Weather Type</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weatherTypeOptions.map((option, index) => (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  weatherType === option && styles.selectedOption,
                ]}
                key={index}
                onPress={() => handleWeatherTypeSelect(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.createProductButton}
          onPress={handleAddProductsPress}
        >
          <Text style={styles.createProductButtonText}>Add Products</Text>
        </TouchableOpacity>
        <Text style={styles.productsTitleText}>Products</Text>
        <View style={styles.productsContainer}>
          {savedItems && savedItems.length > 0 ? (
            savedItems.map((item, index) => (
              <View key={index} style={styles.productCard}>
                <Text style={styles.productCardTitle}>
                  {typeof item === "number" ? item : item.itemName}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.productCard}>
              <Text style={styles.productCardTitle}>No selected items</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B7C4CF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabTop: {
    marginTop: 30,
    width: 180,
    backgroundColor: "white",
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 8,
    paddingLeft: 30,
    paddingTop: 13,
  },
  tabText: {
    fontFamily: "Lato-Bold",
    fontSize: 23,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  createRoutineButton: {
    width: "25%",
    height: 40,
    backgroundColor: "rgba(1, 90, 131, 255)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 40,
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
    width: "15%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 45,
    marginRight: 10,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "rgba(1, 90, 131, 255)",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  newNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  titleNameText: {
    fontSize: 20,
    color: "#015A83",
    fontFamily: "Lato-Bold",
  },
  searchBox: {
    flex: 1,
    height: 50,
    borderWidth: 3,
    borderColor: "rgba(1, 90, 131, 255)",
    borderRadius: 10,
    marginLeft: 10,
    padding: 15,
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "PlayfairDisplay-Bold",
  },
  selectContainer: {
    flex: 1,
    marginHorizontal: 18,
    backgroundColor: "white",
    marginBottom: 20,
    flexDirection: "row",
  },
  selectContainerLeft: {
    width: 100,
  },
  createProductButton: {
    width: 300,
    height: 50,
    backgroundColor: "rgb(80, 122, 145)",
    borderRadius: 25,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  createProductButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  descriptionParentContainer: {
    alignItems: "center",
  },
  descriptionContainerTop: {
    width: 350,
    height: 50,
    borderColor: "rgba(1, 90, 131, 255)",
    borderWidth: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  descriptionContainer: {
    width: 350,
    height: 200,
    backgroundColor: "white",
    padding: 10,
    borderColor: "rgba(1, 90, 131, 255)",
    borderWidth: 3,
    borderTopWidth: 0,
    textAlignVertical: "top",
    textAlign: "left",
    marginBottom: 30,
  },
  descriptionTitleText: {
    fontSize: 20,
    color: "#015A83",
    fontFamily: "Lato-Bold",
    marginLeft: 15,
  },
  publicToggle: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
    textAlign: "center",
  },
  optionButton: {
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: "#ddd",
    borderRadius: 30,
  },
  selectedOption: {
    backgroundColor: "#666",
  },
  optionText: {
    fontFamily: "Lato-Bold",
  },
  productsTitleText: {
    marginHorizontal: 18,
    marginBottom: 15,
    fontSize: 20,
    color: "#015A83",
    fontFamily: "Lato-Bold",
  },
  productCard: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 50,
    backgroundColor: "#EEE3CB",
    padding: 20,
    marginBottom: 20,
    height: 80,
    justifyContent: "center",
  },
  productCardTitle: {
    fontFamily: "Lato-BoldItalic",
    fontSize: 18,
    color: "rgba(1,90,131,255)",
  },
  productsContainer: {
    marginHorizontal: 18,
  },
});

export default CreateNewRoutineScreen;
