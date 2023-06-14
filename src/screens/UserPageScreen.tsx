import React, {
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
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
      const response = await fetch(
        `http://10.0.2.2:8080/routine/user/${userId}`
      );
      const data = await response.json();
      setUserRoutines(data);
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
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>nourish.</Text>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/nourish_logo.png")}
        />
      </View>
      <View style={styles.line} />
      <Text style={styles.infoText}>My Routines</Text>
      {fetchRoutinesError ? (
        <Text>There was an error fetching routines</Text>
      ) : null}
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
          <Text>{routine.routine_name}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity onPress={handleCreateNewRoutinePress}>
          <AntDesign name="pluscircle" size={50} color="rgba(1,90,131,255)" />
        </TouchableOpacity>
      </View>
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
    marginTop: 15,
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
    width: 100,
    height: 100,
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
  createButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
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

export default UserPageScreen;
