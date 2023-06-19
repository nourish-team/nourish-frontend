import React, { useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    handleFetchLikesHistory();
  }, []);

  const handleFetchProductNames = async (itemId: number) => {
    const response = await fetch(`http://10.0.2.2:8080/product/id/${itemId}`);
    const data = await response.json();
    return { product: data.product_name, brand: data.brand };
  };

  const handleFetchLikesHistory = async () => {
    console.log("USER ID ", userId);
    try {
      const response = await fetch(`http://10.0.2.2:8080/like/user/${userId}`);
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
                        (product: { product: string; brand: string }) => (
                          <View style={styles.productContainer}>
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
    width: 330,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 20,
    backgroundColor: "#B7C4CF",
    padding: 20,
  },
  routineInnerContainer: {
    backgroundColor: "#EEE3CB",
    padding: 10,
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
    backgroundColor: "white",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  backgroundText: {
    color: "grey",
  },
  skinTypeText: {
    color: "",
    textAlign: "right",
    fontFamily: "Lato-Bold",
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
  },
  brandName: {
    fontFamily: "PlayfairDisplay-Bold",
    color: "#967E76",
    textDecorationLine: "underline",
  },
  productName: {
    fontFamily: "Lato-Bold",
    color: "#2D4654",
  },
  productContainer: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderRadius: 40,
    padding: 15,
    marginBottom: 5,
  },
  logo: {
    height: 170,
    width: 170,
    alignSelf: "center",
    marginTop: -30,
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
  },
  description: {
    padding: 5,
    fontFamily: "Lato-Bold",
    backgroundColor: "white",
  },
  toggleDescription: {
    marginBottom: 5,
  },
  descriptionContainer: {
    backgroundColor: "#F0F8EA",
    marginTop: 10,
    padding: 5,
  },
});
export default UsersLikesScreen;
