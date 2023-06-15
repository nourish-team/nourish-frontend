import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button, Pressable, TouchableOpacity } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import UserContext from "../contexts/UserContext";

const SkincareTypeScreen: React.FC<{ route: any }> = ({ route }) => {
  const { skincareType } = route.params;
  const [routinesByType, setRoutinesByType] = useState<any[]>([]);
  const [fetchRoutinesError, setFetchRoutinesError] = useState(false);
  const [like, setLike] = useState(false);
  const {userId} = useContext(UserContext);
  
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleBackPress = () => {
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    fetchRoutinesByType();
  }, []);

  useEffect(() => {
    console.log(like)
  }, [like])

  const fetchRoutinesByType = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/routine/skintype/${skincareType.toLowerCase()}`);
      const data = await response.json();

      const likedResponse = await fetch(`http://10.0.2.2:8080/like/user/${userId}`);
      const likedData = await likedResponse.json();
      const likedRoutineIds = likedData.map((like: any) => like.routine_id.id);

      const routinesWithLikes = data.map((routine: any) => ({
        ...routine,
        liked: likedRoutineIds.includes(routine.id),
      }))
      setRoutinesByType(routinesWithLikes);
    } catch (error) {
      setFetchRoutinesError(true);
    }
  };

  const handelPostLike = async (routineId:number) => {
    console.log("user id", userId, "routine", routineId, "was clicked clicked");
    const postReq = {
      users_id: userId,
      routines_id: routineId,
      like: true
    }
    
    try {
      const response = await fetch(`http://10.0.2.2:8080/like/routine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postReq),
      }); 
      const data = await response.json();

      setRoutinesByType(prevRoutines =>
        prevRoutines.map(routine => {
          if (routine.id === routineId) {
            return {
              ...routine,
              liked: true,
            };
          }
          return routine;
        })
      );
        // setLike(data.routines_id);
    } catch (error) {
      console.error(error);
    }
  }

  // const handleDisplayLikes = (routine: []) => {
  //   console.log()
  //   return <>5</>
  // }

  return (
    <View style={styles.container}>
      {fetchRoutinesError ? <Text>"Oops, something went wrong"</Text>: null}
      <Text>You selected {skincareType} skin type</Text>
      {routinesByType.map((routine: any) => (
        <View key={routine.id} style={styles.routineContainer}>
          <Text style={styles.routineName}>{routine.routine_name}</Text>
          <Text style={styles.routineProduct}>{routine.routine_product}</Text>
          <Text style={styles.createdAt}>{routine.created_at}</Text>
          <TouchableOpacity
          style={styles.likeButton}
          onPress={() => handelPostLike(routine.id)}
          >
          {routine.liked ? (
            <Icon name="heart" size={20} color="#FFD1DC" />
          )
          : (
            <Icon name="heart-o" size={20} />
          )
        }
          
          <Text>Like</Text>
          </TouchableOpacity>
          <Text>{routine["_count"].likes}</Text>
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
  

//   return (
//     <View style={styles.container}>
//       <Text>You selected {skincareType} skin type</Text>
//       {routinesByType.map((routine: any) => (
//         <View style={styles.routine} key={routine.id}>
//           <Text>{routine.routine_name}</Text>
//           <Text>{routine.routine_product}</Text>
//           <Text>{routine.created_at}</Text>
//           <Pressable style={styles.button} onPress={() => handelPostLike(routine.id)}>
//             <Text>Like</Text>
//           </Pressable>
          
//         </View>
//       ))}
//       <Button title="Back" onPress={handleBackPress} />  
//     </View>  
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 70,
//     flex: 1,
//     backgroundColor: "#FFFDD0",
//     paddingLeft: 20,
//     paddingRight: 20,
//   },
//   routine: {
//     marginBottom: 20
//   },
//   button: {
//       width: 60,
//       backgroundColor: "#FFB6C1",
//   }
// });

export default SkincareTypeScreen;
