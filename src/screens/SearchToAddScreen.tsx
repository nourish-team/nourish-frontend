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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

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
        setCurrentPage(1);
        setTotalPages(Math.ceil(data.length / PAGE_SIZE));
      } else {
        setSearchResults([]);
        setFetchItemsError(true);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      setSearchResults([]);
      setFetchItemsError(true);
      setCurrentPage(1);
      setTotalPages(1);
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

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const endIndex = currentPage * PAGE_SIZE;
  const startIndex = endIndex - PAGE_SIZE;
  const paginatedData = searchResults.slice(startIndex, endIndex);

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
      {searchResults.length > 0 && (
      <View style={styles.resultContainer}>
        {fetchItemsError ? <Text>Oops! Brand not found</Text> : null}
        <FlatList
          data={paginatedData}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleItemSelect(item.id)}
              style={styles.card}
            >
              <Text>{item.product_name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.paginationContainer}>
            <TouchableOpacity
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
              >
                <Text style={styles.paginationButtonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
              >
                <Text style={styles.paginationButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
      </View>
      )}
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: "rgba(1, 90, 131, 255)",
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "white",
  },
});

export default SearchToAddScreen;
