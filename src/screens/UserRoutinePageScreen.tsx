import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
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
  const { routineId, routineName, routineProduct, routineDescription } =
    route.params;
  const [products, setProducts] = useState<
    { productName: string; productBrand: string; productId: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState(routineDescription);
  const [description, setDescription] = useState<string | null>(
    routineDescription
  );

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  const handleAddJournalPress = () => {
    navigation.navigate("AddJournalScreen", { routineId });
  };

  const handleJournalHistoryPress = () => {
    navigation.navigate("JournalHistoryScreen", { routineId, routineName });
  };

  const handleAddProduct = () => {
    navigation.navigate("SearchToAddScreen", {
      routineId,
      routineName,
      routineProduct,
    });
  };

  const handleDeleteProduct = async (itemId: number) => {
    const productsList = products.map((product) => product.productId);
    const newRoutineProducts = productsList.filter(
      (product) => product !== itemId
    );
    console.log("newroutine stuff ", newRoutineProducts);
    const routineData = {
      routine_id: routineId,
      routine_product: newRoutineProducts,
      public: true,
    };
    try {
      const response = await fetch(`https://nourishskin.herokuapp.com/routine/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routineData),
      });

      if (response.ok) {
        alert("Product deleted.");
        setProducts(products.filter((product) => product.productId !== itemId));
      } else {
        alert("Oops, something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Oops, something went wrong. Please try again.");
    }
  };

  const fetchAndDisplayProducts = useCallback(async () => {
    setLoading(true);
    setProducts([]);

    try {
      const fetchPromises = routineProduct.map(async (pid) => {
        const response = await fetch(`https://nourishskin.herokuapp.com/product/id/${pid}`);
        const data = await response.json();
        const newProduct = {
          productName: data.product_name,
          productBrand: data.brand,
          productId: data.id,
        };
        return newProduct;
      });

      const newProducts = await Promise.all(fetchPromises);
      console.log("newproducts ", newProducts);
      setProducts(newProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [routineProduct]);

  const toggleDescriptionModal = () => {
    setDescriptionModalVisible(!descriptionModalVisible);
  };

  const handleUpdateDescription = async () => {
    const routineData = {
      id: routineId,
      description: newDescription,
    };

    try {
      const response = await fetch(
        `https://nourishskin.herokuapp.com/routine/update/description`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(routineData),
        }
      );
      const data = response.json();

      if (response.ok) {
        alert("Description updated.");
        toggleDescriptionModal();
        setDescription(newDescription);
      } else {
        alert("Oops, something went wrong! Please try again.");
      }
    } catch (error) {
      alert("Error.");
    }
  };

  useEffect(() => {
    fetchAndDisplayProducts();
    console.log("ROUTINE DESC: ", routineDescription);
  }, [routineProduct, description]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={descriptionModalVisible}
        onRequestClose={() => {
          toggleDescriptionModal();
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={toggleDescriptionModal}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Description</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewDescription}
                defaultValue={newDescription || ""}
                multiline
              />
              <View style={styles.descriptionButtonContainer}>
                <TouchableOpacity
                  style={styles.saveDescriptionButton}
                  onPress={handleUpdateDescription}
                >
                  <Text style={styles.modalSaveTextStyle}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelDescriptionButton}
                  onPress={toggleDescriptionModal}
                >
                  <Text style={styles.modalCancelTextStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <AntDesign name="doubleleft" size={20} color="#015a83" />
        </TouchableOpacity>
        <Text style={[styles.titleText, styles.buttonMargin]}>
          {routineName}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.contentContainer}>
          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionContainerTop}>
              <Text style={styles.descriptionTitleText}>description</Text>
              <Text
                style={styles.descriptionTitleText}
                onPress={handleBackPress}
              >
                ⊹⊹⊹
              </Text>
            </View>
            <View style={styles.descriptionContainerBottom}>
              <TouchableOpacity
                style={styles.editDescriptionButton}
                onPress={toggleDescriptionModal}
              >
                <Text style={styles.editDescriptionButtonText}>edit</Text>
              </TouchableOpacity>
              {description ? (
                <Text style={styles.descriptionText}>{description}</Text>
              ) : (
                <Text style={styles.descriptionText}>
                  i'm just a little description box
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
          <View style={styles.textBubbleContainer}>
            <View style={styles.textBubble}>
              <Text style={styles.textBubbleText}>
                how was your {"\n"}skin today?
              </Text>
            </View>
            <View style={styles.leftArrow} />
            <Image
              source={require("../../assets/images/nourish_logo.png")}
              style={styles.tinyLogo}
            />
          </View>
          <ImageBackground
            source={require("../../assets/images/journal-withtext.png")}
            style={styles.imageContainer}
            resizeMode="contain"
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddJournalPress}
              >
                <Text style={styles.buttonText}>
                  Add{"\n"}Journal{"\n"}Entry
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleJournalHistoryPress}
              >
                <Text style={styles.buttonText}>Journal{"\n"}History</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Text style={styles.separator}>⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹⊹</Text>
          <View style={styles.productsContainer}>
            <View style={styles.productsContainerHeader}>
              <Text style={styles.productsContainerTitle}>
                {products.length}
                {products.length > 1 ? <Text> steps</Text> : <Text> step</Text>}
              </Text>
              <TouchableOpacity onPress={handleAddProduct}>
                <Text style={styles.infoText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {products.map((product, index) => (
              <View key={product.productId} style={styles.card}>
                <View key={index} style={styles.brandContainer}>
                  <Text style={styles.brandName}>
                    {product.productBrand.toUpperCase()}
                  </Text>
                  <Text
                    style={styles.brandName}
                    onPress={() => handleDeleteProduct(product.productId)}
                  >
                    ✖︎
                  </Text>
                </View>
                <Text style={styles.productName}>{product.productName}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#EEE3CB",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tinyLogo: {
    width: 70,
    height: 70,
  },
  titleText: {
    fontSize: 30,
    fontFamily: "PlayfairDisplay-Bold",
    color: "rgba(1,90,131,255)",
    marginBottom: 10,
    marginTop: -15,
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
    color: "white",
    lineHeight: 25,
    marginRight: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "rgba(1,90,131,255)",
    backgroundColor: "rgba(1,90,131,255)",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  contentContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  descriptionContainer: {
    margin: 40,
  },
  descriptionContainerTop: {
    height: 40,
    borderColor: "rgba(1,90,131,255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    backgroundColor: "#B7C4CF",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  descriptionContainerBottom: {
    backgroundColor: "white",
    padding: 20,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
  },
  descriptionTitleText: {
    fontFamily: "Lato-Bold",
    padding: 10,
    color: "black",
    fontSize: 15,
  },
  imageContainer: {
    width: 300,
    height: 300,
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -40,
  },
  button: {
    flex: 1,
    width: "60%",
    height: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "transparent",
    fontSize: 16,
    fontFamily: "PlayfairDisplay-Bold",
    textAlign: "center",
  },
  buttonMargin: {
    marginLeft: 25,
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(1, 90, 131, 255)",
  },
  separator: {
    color: "rgba(1,90,131,255)",
    fontSize: 15,
    textAlign: "center",
  },
  productsContainer: {
    margin: 30,
  },
  productsContainerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsContainerTitle: {
    fontSize: 25,
    fontFamily: "PlayfairDisplay-Bold",
    backgroundColor: "#EEE3CB",
    width: 100,
    textAlign: "center",
    borderRadius: 30,
    padding: 5,
    marginBottom: 20,
  },
  brandContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandName: {
    color: "gray",
    fontFamily: "PlayfairDisplay-Bold",
  },
  productName: {
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "Lato-Bold",
  },
  textBubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 30,
    marginBottom: -10,
    alignSelf: "flex-end",
  },
  leftArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: "#D0D0D0",
    transform: [{ rotate: "270deg" }],
  },
  textBubble: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#D0D0D0",
    borderRadius: 10,
    maxWidth: "80%",
  },
  textBubbleText: {
    fontSize: 16,
  },
  descriptionText: {
    fontFamily: "Lato-BoldItalic",
    color: "gray",
  },
  editDescriptionButton: {
    alignSelf: "flex-end",
  },
  editDescriptionButtonText: {
    textDecorationLine: "underline",
    marginTop: -10,
    marginBottom: 15,
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "Lato-Bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Lato-Bold",
  },
  input: {
    height: 150,
    width: 250,
    marginBottom: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 20,
  },
  modalSaveTextStyle: {
    color: "black",
    textAlign: "center",
    fontFamily: "Lato-Bold",
    fontSize: 15,
  },
  modalCancelTextStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Lato-Bold",
    fontSize: 15,
  },
  saveDescriptionButton: {
    backgroundColor: "#EEE3CB",
    borderColor: "transparent",
    borderWidth: 2,
    borderRadius: 30,
    padding: 15,
  },
  cancelDescriptionButton: {
    backgroundColor: "rgba(1, 90, 131, 255)",
    borderColor: "transparent",
    borderWidth: 2,
    borderRadius: 30,
    padding: 15,
  },
  descriptionButtonContainer: {
    flexDirection: "row",
    gap: 15,
  },
});

export default UserRoutinePageScreen;
