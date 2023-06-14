import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type SearchToAddScreenRouteProp = RouteProp<
  RootStackParamList,
  "SearchToAddScreen"
>;

type SearchToAddScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchToAddScreen"
>;

type Props = {
  route: SearchToAddScreenRouteProp;
  navigation: SearchToAddScreenNavigationProp;
};

type SearchResult = {
  brand: string;
  id: number;
  product_name: string;
};

const SearchToAddScreen: React.FC<Props> = ({ route, navigation }) => {
  const { routineId, routineName, routineProduct } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [fetchItemsError, setFetchItemsError] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  useEffect(() => {}, [routineId]);

  const handleSearchItem = async (brand: string) => {
    console.log("BRAND ", brand);
    try {
      const acceptDifferences = brand.toLowerCase();
      const encodedBrand = encodeURIComponent(acceptDifferences);
      const response = await fetch(
        `http://10.0.2.2:8080/product/${encodedBrand}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setFetchItemsError(false);
      } else {
        setSearchResults([]);
        setFetchItemsError(true);
      }
    } catch (error) {
      setSearchResults([]);
      setFetchItemsError(true);
    }
  };

  const handleItemSelect = async (itemId: number) => {
    const newRoutineProducts = routineProduct.concat(itemId);
    const routineData = {
      routine_id: routineId,
      routine_product: newRoutineProducts,
      public: true,
    };
    console.log("ROUTINE DATA ", routineData);
    try {
      const response = await fetch(`http://10.0.2.2:8080/routine/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routineData),
      });

      if (response.ok) {
        console.log("response ok");
        setUpdateError(false);
        navigation.navigate("UserRoutinePageScreen", {
          routineId,
          routineName,
          routineProduct: newRoutineProducts,
        });
      } else {
        console.log("response not ok");
        setUpdateError(true);
      }
    } catch (error) {
      setUpdateError(true);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.titleText}>Search for products by brand</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBox}
        />
        <TouchableOpacity
          onPress={() => handleSearchItem(searchQuery)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Search {routineId}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultContainer}>
        {fetchItemsError ? <Text>Oops! Brand not found</Text> : null}
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleItemSelect(item.id)}
              style={styles.card}
            >
              <Text>{item.product_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDD0",
    paddingTop: 70,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 70,
  },
  searchContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 25,
    marginLeft: -25,
    marginBottom: 10,
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
  button: {
    width: 300,
    height: 50,
    backgroundColor: "rgba(1, 90, 131, 255)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  resultContainer: {
    flex: 1,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(1, 90, 131, 255)",
  },
});

export default SearchToAddScreen;
