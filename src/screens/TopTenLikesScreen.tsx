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

type RoutineProps = {
  likes: number;
  createdAt: string;
  description: string;
  routineName: string;
  products: { brand: string; id: number; product_name: string }[];
  userName: string;
  weather: string;
};

const TopTenLikesScreen: React.FC = () => {
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
      const result = await fetch("https://nourishskin.herokuapp.com/routine/top10");
      const routineList = await result.json();
      const routinesInfo: RoutineProps[] = [];
      // get names for products in each routine
      for (const routine of routineList) {
        const productNames = await Promise.all(
          routine.routine_product.map(
            async (product: number | string) =>
              await fetch(`https://nourishskin.herokuapp.com/product/id/${product}`).then(
                async (res) => await res.json()
              )
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
    // navigation.navigate("HomeScreen");
  };
  // map top ten

  const mapRoutines = topTen.map((routine: RoutineProps, index) => (
    <View key={index} style={styles.parentContainer}>
        <View style={styles.routineContainer}>
          <View style={styles.containerImg}>
            <Image
            source={require("../../assets/images/topten.png")}
            style={styles.topTenImage}
            resizeMode="contain"
            />
          </View>
          <View style={styles.infoRoutine}>
            <Text style={styles.routineNameText}>{routine.routineName}</Text>
            <Text>{routine.userName}</Text>
            <View style={styles.productContainer}>
              {routine.products.map((product) => (
                <>
                  <Text style={styles.brandName}>{product.brand}</Text>
                  <Text style={styles.productName}>{product.product_name}</Text>
                </>
              ))}
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
          </View>
          </View>
          {/* <Text>{routine.weather}</Text>
          <TouchableOpacity style={styles.heart}>
            <Text>{routine.likes}</Text>
            <Icon name="heart" size={25} color="#FFD1DC" />
          </TouchableOpacity> */}
        </View>
    </View>
  ));

  return (
    <View style={styles.containerPage}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <AntDesign name="doubleleft" size={40} color="#015a83" />
        </TouchableOpacity>
      <Text style={styles.headerText}>
        Home
      </Text>
      </View>
      <View style={styles.containerFeed}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.routinesParentContainer}>
            {topTen && mapRoutines}
          </View>
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
  header: {
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 30,
    color: "rgba(1,90,131,255)",
    marginLeft: 10,
  },
  scrollView: {
    // borderWidth: 2,
    // borderColor: "red",
  },
  containerFeed: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  parentContainer: {
    display: "flex",
    alignItems: "center",
    height: 200,
    marginTop: 10,
    marginLeft: 1,
    marginRight: 1,
    borderWidth: 2,
    borderColor: "pink"
  },
  routineContainer: {
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    // marginTop: 20,
    width: "100%",
  },
  infoRoutine: {
    backgroundColor: "#B7C4CF",
    width: "70%"
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
  containerImg: {
    display: "flex",
    justifyContent: "center",
    width: "30%",
    height: "100%",
    // backgroundColor: "blue",
  },
  topTenImage: {
    width: 100,
    height: 100,
    marginRight: 20
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",

  // },
  // imageContainer: {
  //   position: "absolute",
  //   top: 0,
  //   height: Dimensions.get("window").height * 0.15,
  //   width: Dimensions.get("window").width,
  // },
  // image: {
  //   height: "100%",
  //   width: "100%",
    
  // },
  // titleContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   padding: 10,
  // },
  // titleText: {
  //   fontSize: 20,
  //   fontFamily: "Lato-Bold",
  //   color: "white",
  //   letterSpacing: 1.5,
  //   marginBottom: 30,
  //   marginTop: Dimensions.get("window").height * 0.06,
  //   textAlign: "center",
  // },
  // routinesParentContainer: {
  //   alignItems: "center",
  //   marginBottom: 120,
  // },
  // routineMainContainer: {
  //   alignItems: "center",
  //   marginBottom: 20,
  // },
  // routineOuterContainer: {
  //   width: 330,
  //   borderWidth: 2,
  //   borderColor: "transparent",
  //   borderRadius: 20,
  //   backgroundColor: "#B7C4CF",
  //   padding: 20,
  // },
  // routineInnerContainer: {
  //   backgroundColor: "#EEE3CB",
  //   padding: 10,
  // },
  // vLineContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "flex-end",
  // },
  // vLineLeft: {
  //   width: 2,
  //   height: 100,
  //   backgroundColor: "black",
  //   transform: [{ rotate: "-45deg" }],
  //   marginRight: 10,
  //   position: "relative",
  //   bottom: -50,
  // },
  // vLineRight: {
  //   width: 2,
  //   height: 100,
  //   backgroundColor: "black",
  //   transform: [{ rotate: "45deg" }],
  //   marginLeft: 10,
  //   position: "relative",
  //   bottom: -50,
  // },
  // routineNameText: {
  //   backgroundColor: "white",
  //   fontFamily: "PlayfairDisplay-Bold",
  //   fontSize: 20,
  //   letterSpacing: 1,
  // },
  // backgroundText: {
  //   color: "grey",
  // },
  // skinTypeText: {
  //   color: "",
  //   textAlign: "right",
  //   fontFamily: "Lato-Bold",
  //   fontSize: 15,
  //   marginBottom: 5,
  //   marginTop: 5,
  // },
  // brandName: {
  //   fontFamily: "PlayfairDisplay-Bold",
  //   color: "#967E76",
  //   textDecorationLine: "underline",
  // },
  // productName: {
  //   fontFamily: "Lato-Bold",
  //   color: "#2D4654",
  // },
  // productContainer: {
  //   backgroundColor: "white",
  //   alignSelf: "flex-start",
  //   borderRadius: 40,
  //   padding: 15,
  //   marginBottom: 5,
  // },
  // logo: {
  //   height: 170,
  //   width: 170,
  //   alignSelf: "center",
  //   marginTop: -30,
  //   marginBottom: -12,
  // },
  // separator: {
  //   color: "rgba(1,90,131,255)",
  //   fontSize: 15,
  //   textAlign: "center",
  //   marginBottom: -30,
  // },

  // descriptionContainer: {
  //   backgroundColor: "#F0F8EA",
  //   marginTop: 10,
  //   padding: 5,
  // },
  // heart: {
  //   alignSelf: "flex-end",
  //   marginTop: 10,
  // },
});
export default TopTenLikesScreen;
