import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";

import {
  ParamListBase,
  useNavigation,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import Icon from "react-native-vector-icons/FontAwesome";
import UserContext from "../contexts/UserContext";

type RoutineType = {
  _count: { likes: number };
  created_at: string;
  description: string;
  id: number;
  liked: boolean;
  products: {
    brand: string;
    productName: string;
  }[];
  routine_name: string;
  routine_product: number[];
  user_id: {
    id: number;
    username: string;
  };
  weather_type: string;
};

type Like = {
  users_id: number;
  routine_id: {
    id: number;
    routine_name: string;
    routine_product: number[];
    skin_type: string;
    description: string | null;
  };
};

type SkinCareTypeScreenRouteProp = RouteProp<
  RootStackParamList,
  "SkincareType"
>;

type Props = {
  route: SkinCareTypeScreenRouteProp;
};

const SkincareTypeScreen: React.FC<Props> = ({ route }) => {
  const { skincareType } = route.params;
  const [routinesByType, setRoutinesByType] = useState<RoutineType[]>([]);
  const [fetchRoutinesError, setFetchRoutinesError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(UserContext);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    fetchRoutinesByType();
    // console.log(routinesByType);
  }, []);

  // useEffect(() => {
  //   console.log("render", routinesByType)
  // }, [routinesByType]);

  const fetchRoutinesByType = async () => {
    try {
      const response = await fetch(
        `https://nourishskin.herokuapp.com/routine/skintype/${skincareType.toLowerCase()}`
      );
      const data = await response.json();

      const likedResponse = await fetch(
        `https://nourishskin.herokuapp.com/like/user/${userId}`
      );
      const likedData = await likedResponse.json().then((r) => {
        console.log(r);
        return r;
      });
      const likedRoutineIds = likedData.map((like: Like) => {
        like.routine_id.id;
      });

      const routinesWithLikes = [];

      for (const routine of data) {
        const productPromises = routine.routine_product.map(
          (productId: number) =>
            fetch(`https://nourishskin.herokuapp.com/product/id/${productId}`)
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
        `https://nourishskin.herokuapp.com/like/unlike/?userid=${userId}&routineid=${routineId}`,
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
      const response = await fetch(
        `https://nourishskin.herokuapp.com/like/routine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postReq),
        }
      );

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
    if (liked) {
      handleDeleteLike(routineId);
    } else {
      handlePostLike(routineId);
    }
  };

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const filterOnCategory = (category: string) => {
    if (category !== "all") {
      const filterData = routinesByType.filter((routine) => {
        return routine["weather_type"] === category;
      });
      setRoutinesByType(filterData);
    } else {
      fetchRoutinesByType();
    }
  };

  const filterOnLikes = (category: string) => {
    if (category === "lowest") {
      const filterdata = routinesByType.sort((a, b) => {
        return a._count.likes - b._count.likes;
      });
      setRoutinesByType(filterdata);
    } else {
      const filterdata = routinesByType.sort((a, b) => {
        return b._count.likes - a._count.likes;
      });
      setRoutinesByType(filterdata);
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
        <Text style={styles.titleText}>{skincareType} routines</Text>
      </View>
      <View style={styles.navButton}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleModal}>
          <Text style={styles.backText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filter}>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            handleModal();
          }}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            onPressOut={handleModal}
          >
            <View style={styles.modalView}>
              <Text style={styles.titleFilter}>Filter on</Text>
              <View style={styles.filterTag}>
                <Text style={styles.categoryTitle}>
                  ⊹⊹⊹⊹⊹ weather type ⊹⊹⊹⊹⊹
                </Text>
                <View style={styles.category}>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnCategory("dry air")}
                  >
                    <Text style={styles.categoryText}>dry air</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnCategory("hot air")}
                  >
                    <Text style={styles.categoryText}>hot air</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnCategory("humid air")}
                  >
                    <Text style={styles.categoryText}>humid air</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnCategory("all")}
                  >
                    <Text style={styles.categoryText}>all</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.filterTag}>
                <Text style={styles.categoryTitle}>⊹⊹⊹⊹⊹ likes ⊹⊹⊹⊹⊹</Text>
                <View style={styles.category}>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnLikes("highest")}
                  >
                    <Text style={styles.categoryText}>highest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryTag}
                    onPress={() => filterOnLikes("lowest")}
                  >
                    <Text style={styles.categoryText}>lowest</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.backButtonFilter}
                onPress={handleModal}
              >
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      {fetchRoutinesError && <Text>Oops, something went wrong</Text>}
      <ScrollView>
        {routinesByType.map((routine: RoutineType) => (
          <View key={routine.id} style={styles.routineContainer}>
            <View style={styles.routineContainerTop}>
              <Text style={styles.userName}>{routine.user_id.username}</Text>
              <Text style={styles.stars}>⊹</Text>
              <Text style={styles.routineName}>{routine.routine_name}</Text>
              <Text style={styles.createdAt}>{routine.created_at}</Text>
            </View>

            <View style={styles.routineContainerBottom}>
              {routine.products.map(
                (
                  product: { brand: string; productName: string },
                  index: number
                ) => (
                  <View key={index} style={styles.routineProduct}>
                    <Text style={styles.brandName}>⊹ {product.brand}</Text>
                    <Text style={styles.productName}>
                      {product.productName}
                    </Text>
                  </View>
                )
              )}
              {routine.description && (
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>
                    {routine.description}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleClickLike(routine.id, routine.liked)}
              >
                {routine.liked ? (
                  <Icon name="heart" size={30} color="#015a83" />
                ) : (
                  <Icon name="heart-o" size={30} />
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
    height: 60,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  routineContainer: {
    // width: "90%",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  routineName: {
    // margin: 10,
    fontFamily: "Lato-BoldItalic",
    fontSize: 26,
  },
  userName: {
    fontFamily: "Lato-BoldItalic",
    fontSize: 26,
    marginLeft: 13,
    padding: 6,
    marginRight: 0,
    paddingRight: 0,
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
    marginLeft: 13,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    paddingLeft: 6,
  },
  stars: {
    fontSize: 25,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    padding: 10,
  },
  descriptionBox: {
    width: "100%",
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: "Lato-Regular",
    fontSize: 17,
    padding: 4,
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
    paddingBottom: 0,
    marginBottom: 38,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    color: "white",
    letterSpacing: 1.5,
    marginBottom: 30,
    marginTop: Dimensions.get("window").height * 0.05,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#EEE3CB",
    borderRadius: 30,
    width: 150,
    height: 50,
    alignSelf: "center",
    padding: 10,
    // marginBottom: 30,
    margin: 5,
  },

  filterButton: {
    borderWidth: 3,
    borderColor: "rgba(1,90,131,255)",
  },

  backText: {
    textAlign: "center",
    fontFamily: "Lato-Bold",
    fontSize: 20,
  },
  routineContainerTop: {
    height: 90,
    borderColor: "rgba(1,90,131,255)",
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    backgroundColor: "#EEE3CB",
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  routineContainerBottom: {
    backgroundColor: "white",
    padding: 20,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
  },
  brandName: {
    color: "black",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 16,
  },
  productName: {
    color: "rgba(1, 90, 131, 255)",
    fontFamily: "Lato-Bold",
    marginBottom: 5,
    fontSize: 16,
  },
  likesText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
  },
  modalView: {
    backgroundColor: "white",
    height: "60%",
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filter: {
    height: 80,
  },
  filterTag: {
    height: 120,
    marginLeft: 15,
    marginBottom: 30,
    // borderWidth: 1,
  },
  category: {
    height: "100%",
    margin: 10,
    marginLeft: 0,
    padding: 4,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    // borderWidth: 1,
  },
  categoryTag: {
    margin: 5,
    width: 120,
    padding: 5,
    borderRadius: 30,
    backgroundColor: "#B7C4CF",
    height: 35,
  },
  categoryText: {
    textAlign: "center",
    fontFamily: "Lato-Bold",
    fontSize: 17,
  },
  categoryTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 22,
    color: "rgba(1,90,131,255)",
    padding: 6,
  },
  titleFilter: {
    fontFamily: "PlayfairDisplay-Bold",
    color: "white",
    letterSpacing: 1,
    backgroundColor: "rgba(1,90,131,255)",
    fontSize: 27,
    padding: 15,
    marginBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  backButtonFilter: {
    backgroundColor: "#EEE3CB",
    borderRadius: 30,
    width: 120,
    height: 50,
    alignSelf: "center",
    padding: 10,
    marginTop: -20,
    justifyContent: "center",
  },
});

export default SkincareTypeScreen;
