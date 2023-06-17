import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import UserContext from "../contexts/UserContext";

const SkincareTypeScreen: React.FC<{ route: any }> = ({ route }) => {
  const { skincareType } = route.params;
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
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/routine/skintype/${skincareType.toLowerCase()}`
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

  const handlePostLike = async (routineId: number) => {
    console.log("User ID:", userId, "Routine ID:", routineId, "was clicked");

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
      console.error("Failed to post like:", error);
    }
  };

  return (
    <View style={styles.container}>
      {fetchRoutinesError && <Text>Oops, something went wrong</Text>}
      <Text>You selected {skincareType} skin type</Text>
      {routinesByType.map((routine: any) => (
        <View key={routine.id} style={styles.routineContainer}>
          <Text style={styles.routineName}>{routine.routine_name}</Text>
          <View>
            {routine.products.map((product: any, index: number) => (
              <Text key={index} style={styles.routineProduct}>
                {product.brand}
                {product.productName}
              </Text>
            ))}
          </View>
          <Text style={styles.createdAt}>{routine.created_at}</Text>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => handlePostLike(routine.id)}
          >
            {routine.liked ? (
              <Icon name="heart" size={20} color="#FFD1DC" />
            ) : (
              <Icon name="heart-o" size={20} />
            )}
            <Text>Like</Text>
          </TouchableOpacity>
          <Text>{routine._count.likes}</Text>
        </View>
      ))}
      <Button title="Back" onPress={handleBackPress} />
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
  routineContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FAFAFA",
  },
  routineName: {
    marginTop: 10,
    marginBottom: 10,
  },
  routineProduct: {
    marginBottom: 10,
  },
  createdAt: {
    marginBottom: 10,
  },
  likeButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default SkincareTypeScreen;
