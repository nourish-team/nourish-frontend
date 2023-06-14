import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

type RoutinePageScreenRouteProp = RouteProp<
  RootStackParamList,
  "UserRoutinePageScreen"
>;

type RoutinePageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserRoutinePageScreen"
>;

type Props = {
  route: RoutinePageScreenRouteProp;
  navigation: RoutinePageScreenNavigationProp;
};

const UserRoutinePageScreen: React.FC<Props> = ({ route, navigation }) => {
  const { routineId, routineName, routineProduct } = route.params;
  const [products, setProducts] = useState<string[]>([]);

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleAddJournalPress = () => {
    navigation.navigate("AddJournalScreen", { routineId });
  };

  const handleJournalHistoryPress = () => {
    navigation.navigate("JournalHistoryScreen", { routineId });
  };

  const handleAddProduct = () => {
    navigation.navigate("SearchToAddScreen", {
      routineId,
      routineName,
      routineProduct,
    });
  };

  const fetchProductName = async (id) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/product/id/${id}`);
      const data = await response.json();
      console.log("DATA ", data);
      const newProduct = data.product_name;
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisplayProducts = () => {
    console.log("routineProduct ", routineProduct);
    for (const pid of routineProduct) {
      // console.log("pid ", pid);
      fetchProductName(pid);
    }
  };

  useEffect(() => {
    if (routineProduct) {
      handleDisplayProducts();
    }
  }, [routineProduct]);

  // useFocusEffect(
  //   useCallback(() => {
  //     setProducts([]);
  //     handleDisplayProducts();
  //   }, [])
  // );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <AntDesign name="doubleleft" size={30} color="rgba(1,90,131,255)" />
        </TouchableOpacity>
        <Text style={[styles.titleText, styles.buttonMargin]}>
          {routineName}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAddJournalPress}
          >
            <Text style={styles.buttonText}>Add Journal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={handleJournalHistoryPress}
          >
            <Text style={styles.buttonText}>Journal History</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleAddProduct}>
        <Text style={styles.infoText}>Add Product</Text>
      </TouchableOpacity>
      {products.map((product, index) => (
        <Text key={index} style={styles.card}>
          {product}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#FFFDD0",
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  tinyLogo: {
    width: 40,
    height: 40,
    marginTop: -7,
  },
  titleText: {
    textAlign: "left",
    fontSize: 40,
    fontFamily: "PlayfairDisplay-Bold",
    color: "rgba(1,90,131,255)",
    marginBottom: 20,
    marginTop: -20,
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(1,90,131,255)",
    marginTop: -10,
  },
  infoText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    lineHeight: 25,
    marginBottom: 30,
    marginTop: 30,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: "rgba(1,90,131,255)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  buttonMargin: {
    marginLeft: 25,
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

export default UserRoutinePageScreen;
