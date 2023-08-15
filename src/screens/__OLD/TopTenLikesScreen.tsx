import { Header } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Touchable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type RoutineProps = {
  likes: number;
  createdAt: string;
  description: string;
  routineName: string;
  products: { brand: string; id: number; product_name: string }[];
  userName: string;
  weather: string;
};

type TopTenLikesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TopTen"
>;

type Prop = {
  navigation: TopTenLikesScreenNavigationProp;
};

const TopTenLikesScreen: React.FC<Prop> = ({ navigation }) => {
  // set states
  const [topTen, setTopTen] = useState<RoutineProps[]>([]);
  const [showDescription, setShowDescription] = useState<number[]>([]);

  // use effect
  useEffect(() => {
    fetchTopTen();
  }, []);

  // fetch
  const fetchTopTen = async () => {
    try {
      // get routines
      const result = await fetch(
        "https://nourishskin.herokuapp.com/routine/top10"
      );
      const routineList = await result.json();
      const routinesInfo: RoutineProps[] = [];
      // get names for products in each routine
      for (const routine of routineList) {
        const productNames = await Promise.all(
          routine.routine_product.map(
            async (product: number | string) =>
              await fetch(
                `https://nourishskin.herokuapp.com/product/id/${product}`
              ).then(async (res) => await res.json())
          )
        );
        // set routine properties to display
        const buildInfoSet = async () => {
          return {
            likes: routine._count.likes,
            createdAt: routine.created_at,
            description: routine.description,
            routineName: routine.routine_name,
            products: productNames,
            userName: routine.user_id.username,
            weather: routine.weather_type,
          };
        };
        const infoSet = await buildInfoSet();

        routinesInfo.push(infoSet);
      }
      setTopTen(routinesInfo);
    } catch (err) {
      console.error(err);
    }
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

  const handleBackPress = () => {
    console.log("click");
    navigation.navigate("HomeScreen");
  };
  // map top ten

  const mapRoutines = topTen.map((routine: RoutineProps, index) => (
    <View key={index} style={styles.routineContainer}>
      <View style={styles.infoRoutine}>
        <View style={styles.titleContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/topten-filled.png")}
              style={styles.topTenImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.routineNameText}>
            {routine.routineName} <Text style={styles.grayText}>by</Text>{" "}
            {routine.userName}
          </Text>
        </View>
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
            <Text style={styles.description}>{routine.description}</Text>
          ) : null}
        </View>
        <View style={styles.separatorContainer}>
          <Text style={styles.separator}>⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹</Text>
          <TouchableOpacity style={styles.heart}>
            <Text>{routine.likes} likes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsContainer}>
          {routine.products.map((product) => (
            <View style={styles.productContainer}>
              <Text style={styles.brandName}>{product.brand}</Text>
              <Text style={styles.productName}>{product.product_name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  ));

  return (
    <View style={styles.containerPage}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <AntDesign name="doubleleft" size={40} color="#015a83" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Top 10</Text>
      </View>
      <View style={styles.containerFeed}>
        <ScrollView style={styles.scrollContainer}>
          <View>{topTen && mapRoutines}</View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerPage: {
    paddingTop: 24,
    flex: 1,
    backgroundColor: "#B7C4CF",
  },
  scrollContainer: {
    marginBottom: 50,
  },
  header: {
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 30,
    color: "rgba(1,90,131,255)",
    marginLeft: 10,
  },
  containerFeed: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 25,
    paddingTop: 40,
    marginBottom: 80,
  },
  routineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 2.5,
    borderColor: "#015A83",
    width: "100%",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#EEE3CB",
  },
  infoRoutine: {
    backgroundColor: "white",
    width: "100%",
  },
  routineNameText: {
    backgroundColor: "#EEE3CB",
    fontFamily: "Lato-Bold",
    fontSize: 23,
    color: "#015A83",
    padding: 10,
    borderColor: "#015A83",
    borderBottomWidth: 2,
    width: "75%",
  },
  imageContainer: {
    width: "25%",
    borderColor: "#015A83",
    borderBottomWidth: 2,
  },
  grayText: {
    color: "gray",
  },
  descriptionToggleText: {
    margin: 5,
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 16,
    letterSpacing: 1,
    backgroundColor: "#9BABB8",
    padding: 10,
    color: "white",
  },
  description: {
    margin: 5,
    padding: 10,
    fontFamily: "Lato-Bold",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "transparent",
    elevation: 2,
  },
  toggleDescription: {
    marginBottom: 5,
  },
  topTenImage: {
    width: 80,
    height: 80,
    backgroundColor: "#EEE3CB",
    borderColor: "#015A83",
    borderBottomWidth: 2,
  },
  descriptionContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  productsContainer: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  productContainer: {
    marginBottom: 10,
  },
  brandName: {
    fontFamily: "Lato-Bold",
    fontSize: 17,
    color: "#5A5A5A",
  },
  productName: {
    fontFamily: "Lato-Bold",
    paddingBottom: 10,
    borderColor: "#9BABB8",
    borderBottomWidth: 2,
    fontSize: 14,
  },
  heart: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    padding: 10,
    borderColor: "#015A83",
    borderWidth: 1,
    borderRadius: 20,
    margin: 15,
  },
  likes: {
    fontFamily: "Lato-Bold",
  },
  separatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    marginLeft: 100,
  },
});

export default TopTenLikesScreen;
