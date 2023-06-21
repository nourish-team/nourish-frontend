import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import UserContext from "../contexts/UserContext";

const WeatherTypeScreen: React.FC<{ route: any }> = ({ route }) => {
  const { weatherType } = route.params;
  const [routinesByType, setRoutinesByType] = useState<any[]>([]);
  const [fetchRoutinesError, setFetchRoutinesError] = useState(false);
  const { userId } = useContext(UserContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    fetchRoutinesByType();
  }, []);

  const fetchRoutinesByType = async () => {
    const encodedWeatherType = encodeURIComponent(weatherType);
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/routine/weather/${encodedWeatherType}`
      );
      const data = await response.json();

      const likedResponse = await fetch(
        `http://10.0.2.2:8080/like/user/${userId}`
      );
      const likedData = await likedResponse.json();
      const likedRoutineIds = likedData.map((like: any) => like.routine_id.id);

      const routinesWithLikes = [];

      for (const routine of data) {
        const productPromises = routine.routine_product.map((productId: any) =>
          fetch(`http://10.0.2.2:8080/product/id/${productId}`)
        );

        const productResponses = await Promise.all(productPromises);
        const productDataList = await Promise.all(
          productResponses.map((response) => response.json())
        );

        const products = productDataList.map((productData) => ({
          brand: productData.brand,
          productName: productData.product_name,
        }));

        const routineWithLike = {
          ...routine,
          liked: likedRoutineIds.includes(routine.id),
          // _count: {
          //   likes: routine._count.likes,
          // },
          products,
        };

        routinesWithLikes.push(routineWithLike);
      }

      setRoutinesByType(routinesWithLikes);
    } catch (error) {
      setFetchRoutinesError(true);
    }
  };

  const handleDeleteLike = async (routineId: number) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/like/unlike/?userid=${userId}&routineid=${routineId}`,
        {
          method: "DELETE",
        }
      );

      console.log("delete:", response.status);

      if (response.ok) {
        setRoutinesByType((prevRoutines) =>
          prevRoutines.map((routine) => {
            if (routine.id === routineId) {
              let newLikesCount = routine._count?.likes
                ? routine._count.likes - 1
                : 1;
              return {
                ...routine,
                liked: false,
                _count: {
                  ...routine._count,
                  likes: newLikesCount,
                },
              };
            }
            return routine;
          })
        );
      }
    } catch (error) {
      alert("Oops, please try again.");
    }
  };

  const handlePostLike = async (routineId: number) => {
    console.log("routine id in post:", routineId);
    const postReq = {
      users_id: userId,
      routines_id: routineId,
      like: true,
    };


    try {
      const response = await fetch(`http://10.0.2.2:8080/like/routine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postReq),
      });

      const data = await response.json();
      console.log("post:", response.status);
      if (response.ok) {
        setRoutinesByType((prevRoutines) =>
          prevRoutines.map((routine) => {
            if (routine.id === routineId) {
              let newLikesCount = routine._count?.likes
                ? routine._count.likes + 1
                : 1;
              return {
                ...routine,
                liked: true,
                _count: {
                  ...routine._count,
                  likes: newLikesCount,
                },
              };
            }
            return routine;
          })
        );
      } else {
        console.error("Failed to post like:", response.status);
      }
    } catch (error) {
      console.log(error);
      alert("You've already liked this");
    }
  };

  const handleClickLike = (routineId: number, liked: boolean) => {
    if(liked) {
      handleDeleteLike(routineId);
    } else {
      handlePostLike(routineId);
    };
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
        <Text style={styles.titleText}>{ weatherType } routines</Text>
      </View>
      <View style={styles.navButton}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      {fetchRoutinesError && <Text>Oops, something went wrong</Text>}
      <ScrollView>
        {routinesByType.map((routine: any) => (
          <View key={routine.id} style={styles.routineContainer}>
            <View style={styles.routineContainerTop}>
              <Text style={styles.userName}>{routine.user_id.username}:</Text>
              <Text style={styles.routineName}>{routine.routine_name}</Text>
              <Text style={styles.createdAt}>{routine.created_at}</Text>
            </View>
            <View style={styles.routineContainerBottom}>
              {routine.products.map((product: any, index: number) => (
                <View key={index} style={styles.routineProduct}>
                  <Text style={styles.brandName}>{product.brand}</Text>
                  <Text style={styles.productName}>{product.productName}</Text>
                </View>
                ))}
                {routine.description && 
                <Text>{routine.description}</Text>}
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleClickLike(routine.id, routine.liked)}
              >
                {routine.liked ? (
                  <Icon name="heart" size={20} color="#FFD1DC" />
                ) : (
                  <Icon name="heart-o" size={20} />
                )}
                <Text style={styles.likesText}>
                  {" "}
                  {routine._count.likes}
                  {routine._count.likes > 1 ? (
                    <Text> Likes</Text>
                  ) : routine._count.likes === 0 ? (
                    <Text> Likes</Text>
                  ) : (
                    <Text> Like </Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navButton: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  routineContainer: {
    marginHorizontal: 40,
    marginBottom: 40,
  },
  routineName: {
    margin: 10,
    fontFamily: "Lato-Bold",
    fontSize: 18,
  },
  userName: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 20,
    marginLeft: 6,
  },
  routineProduct: {
    backgroundColor: "#EEE3CB",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginBottom: 5,
  },
  createdAt: {
    margin: 10,
    fontFamily: "Lato-Regular",
  },
  likeButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    marginBottom: 25,
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
  backButton: {
    backgroundColor: "#EEE3CB",
    borderRadius: 30,
    width: 80,
    alignSelf: "center",
    padding: 10,
    marginBottom: 30,
    margin: 5,
  },
  backText: {
    textAlign: "center",
    fontFamily: "Lato-Bold",
    fontSize: 15,
  },
  routineContainerTop: {
    height: 70,
    borderColor: "rgba(1,90,131,255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    backgroundColor: "#B7C4CF",
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  routineContainerBottom: {
    backgroundColor: "white",
    padding: 20,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
  },
  brandName: {
    color: "gray",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 15,
  },
  productName: {
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "Lato-Bold",
    marginBottom: 5,
    fontSize: 15,
  },
  likesText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 15,
  },
});

export default WeatherTypeScreen;