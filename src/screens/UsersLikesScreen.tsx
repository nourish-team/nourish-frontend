import React, { useContext, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import UserContext from "../contexts/UserContext";
import Icon from "react-native-vector-icons/FontAwesome";

type RoutineItem = {
  users_id: number;
  routine_id: {
    id: number;
    routine_name: string;
    routine_product: number[];
    skin_type: string;
    description: string;
  };
};

const UsersLikesScreen: React.FC = () => {
  const { userId } = useContext(UserContext);
  const [routines, setRoutines] = useState<any[]>([]);
  const [showDescription, setShowDescription] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      handleFetchLikesHistory();
    }, [userId])
  );

  const handleFetchProductNames = async (itemId: number) => {
    const response = await fetch(`https://nourishskin.herokuapp.com/product/id/${itemId}`);
    const data = await response.json();
    return { product: data.product_name, brand: data.brand };
  };

  const handleFetchLikesHistory = async () => {
    try {
      const response = await fetch(`https://nourishskin.herokuapp.com/like/user/${userId}`);
      const fetchdata = await response.json();

      const routinesWithNames = await Promise.all(
        fetchdata.map(async (item: RoutineItem) => {
          const routineProducts = await Promise.all(
            item.routine_id.routine_product.map(async (productId: number) => {
              const { product, brand } = await handleFetchProductNames(
                productId
              );
              return { product, brand };
            })
          );

          return {
            ...item,
            routine_id: {
              ...item.routine_id,
              routine_product: routineProducts,
              description: item.routine_id.description,
            },
          };
        })
      );

      setRoutines(routinesWithNames);
    } catch (error) {}
  };

  const handleShowDescription = (index: number) => {
    setShowDescription((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleDeleteLike = async (userId: number, routineId: number) => {
    try {
      const response = await fetch(
        `https://nourishskin.herokuapp.com/like/unlike/?userid=${userId}&routineid=${routineId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRoutines((prevRoutines) =>
          prevRoutines.filter((item) => item.routine_id.id !== routineId)
        );
      } else {
        alert("Oops, something went wrong.");
      }
    } catch (error) {
      alert("Oops, please try again.");
    }
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
        <Text style={styles.titleText}>Likes</Text>
      </View>
      <ScrollView>
        <Image
          source={require("../../assets/images/logo-thumbsup.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
        <View style={styles.routinesParentContainer}>
          {routines &&
            routines.length > 0 &&
            routines.map((routine, index) => (
              <View key={index}>
                <View style={styles.vLineContainer}>
                  <View style={styles.vLineLeft} />
                  <View style={styles.vLineRight} />
                </View>
                <View style={styles.routineOuterContainer}>
                  <View style={styles.routineInnerContainer}>
                    <Text style={styles.routineNameText}>
                      <Text style={styles.backgroundText}>♫:</Text>{" "}
                      {routine.routine_id.routine_name}
                    </Text>
                    <Text style={styles.skinTypeText}>
                      ☀️ {routine.routine_id.skin_type}{" "}
                      <Text style={styles.backgroundText}>°c</Text>
                    </Text>
                    {routine.routine_id.routine_product &&
                      routine.routine_id.routine_product.length > 0 &&
                      routine.routine_id.routine_product.map(
                        (product: { product: string; brand: string }, index: number) => (
                          <View key={index} style={styles.productContainer}>
                            <Text style={styles.brandName}>
                              {product.brand}
                            </Text>
                            <Text style={styles.productName}>
                              {product.product}
                            </Text>
                          </View>
                        )
                      )}
                    <View style={styles.descriptionContainer}>
                      <TouchableOpacity
                        onPress={() => handleShowDescription(index)}
                        style={styles.toggleDescription}
                      >
                        <Text style={styles.descriptionToggleText}>
                          ▾ Toggle description
                        </Text>
                      </TouchableOpacity>
                      {showDescription.includes(index) ? (
                        <Text style={styles.description}>
                          {routine.routine_id.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.heart}
                    onPress={() =>
                      handleDeleteLike(routine.users_id, routine.routine_id.id)
                    }
                  >
                    <Icon name="heart" size={25} color="rgba(1,90,131,255)" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
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
  routinesParentContainer: {
    alignItems: "center",
    marginBottom: 120,
  },
  routineMainContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  routineOuterContainer: {
    width: 340,
    borderWidth: 3,
    borderColor: "rgba(1,90,131,255)",
    borderRadius: 20,
    backgroundColor: "white",
    padding: 20,
  },
  routineInnerContainer: {
    backgroundColor: "white",
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3
  },
  vLineContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  vLineLeft: {
    width: 2,
    height: 100,
    backgroundColor: "black",
    transform: [{ rotate: "-45deg" }],
    marginRight: 10,
    position: "relative",
    bottom: -50,
  },
  vLineRight: {
    width: 2,
    height: 100,
    backgroundColor: "black",
    transform: [{ rotate: "45deg" }],
    marginLeft: 10,
    position: "relative",
    bottom: -50,
  },
  routineNameText: {
    backgroundColor: "#EEE3CB",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 25,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "rgba(1,90,131,255)",
  },
  backgroundText: {
    color: "grey",
  },
  skinTypeText: {
    textAlign: "right",
    fontFamily: "Lato-Bold",
    fontSize: 15,
    padding: 10,
  },
  brandName: {
    fontFamily: "PlayfairDisplay-Bold",
    color: "#967E76",
    textDecorationLine: "underline",
    fontSize: 16
  },
  productName: {
    fontFamily: "Lato-Bold",
    color: "#2D4654",
    fontSize: 16
  },
  productContainer: {
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "rgba(1,90,131,255)",
    width: 250
  },
  logo: {
    height: 170,
    width: 170,
    alignSelf: "center",
    marginTop: -20,
    marginBottom: -12,
  },
  separator: {
    color: "rgba(1,90,131,255)",
    fontSize: 15,
    textAlign: "center",
    marginBottom: -30,
  },
  descriptionToggleText: {
    margin: 5,
    fontFamily: "PlayfairDisplay-Bold",
    color: "#F8ECD3",
    fontSize: 17
  },
  description: {
    padding: 5,
    margin: 10,
    fontFamily: "Lato-Bold",
    backgroundColor: "white",
  },
  toggleDescription: {
    marginBottom: 5,
  },
  descriptionContainer: {
    backgroundColor: "#B7C4CF",
    marginTop: 10,
    padding: 5,
  },
  heart: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
});
export default UsersLikesScreen;
