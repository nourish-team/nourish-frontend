import React, {
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import UserContext from "../contexts/UserContext";

type UserPageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserPageScreen"
>;

const UserPageScreen: React.FC = () => {
  const [userRoutines, setUserRoutines] = useState<any[]>([]);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [fetchRoutinesError, setFetchRoutinesError] = useState(false);
  const { userId } = useContext(UserContext);
  const navigation = useNavigation<UserPageScreenNavigationProp>();

  useEffect(() => {
    fetchRoutines();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoutines();
    }, [])
  );

  const fetchRoutines = async () => {
    try {
      const userIdToString = String(userId);
      const response = await fetch(
        `http://10.0.2.2:8080/routine/user/${userIdToString}`
      );
      const data = await response.json();
      console.log("LONG DATA ", data.productsOfRoutines);
      console.log("USERRR ", data.routinesByUser);
      setUserRoutines(data.routinesByUser);
      setUserProducts(data.productsOfRoutines);
    } catch (error) {
      setFetchRoutinesError(false);
    }
  };

  const handleRoutinePress = (
    routineId: number,
    routineName: string,
    routineProduct: number[]
  ) => {
    navigation.navigate("UserRoutinePageScreen", {
      routineId,
      routineName,
      routineProduct,
    });
  };

  const handleCreateNewRoutinePress = () => {
    navigation.navigate("CreateNewRoutineScreen");
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
        <Text style={styles.titleText}>My Routines</Text>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity onPress={handleCreateNewRoutinePress}>
            <AntDesign name="pluscircle" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={require("../../assets/images/apply-skincare-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
      {fetchRoutinesError ? (
        <Text>There was an error fetching routines</Text>
      ) : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userRoutines.map((routine) => (
          <TouchableOpacity
            style={styles.card}
            key={routine.id}
            onPress={() =>
              handleRoutinePress(
                routine.id,
                routine.routine_name,
                routine.routine_product
              )
            }
          >
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>{routine.routine_name}</Text>
              <Text style={styles.stepText}>
                {routine.routine_product.length}{" "}
                {routine.routine_product.length > 1 ? (
                  <Text>Steps</Text>
                ) : (
                  <Text>Step</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  logo: {
    height: 140,
    width: 140,
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
    padding: 30,
  },
  card: {
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 50,
    backgroundColor: "#EEE3CB",
    padding: 10,
    marginBottom: 20,
    height: 80,
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "Lato-BoldItalic",
    fontSize: 18,
    color: "rgba(1,90,131,255)",
  },
  createButtonContainer: {
    marginBottom: 20,
    position: "absolute",
    top: 50,
    right: 15,
  },
  cardContainer: {
    justifyContent: "space-around",
    paddingLeft: 15,
    paddingRight: 15,
  },
  stepText: {
    fontFamily: "Lato-Bold",
    fontSize: 15,
    paddingTop: 2,
    color: "gray",
  },
  separator: {
    color: "rgba(1,90,131,255)",
    fontSize: 15,
    textAlign: "center",
  },
});

export default UserPageScreen;
