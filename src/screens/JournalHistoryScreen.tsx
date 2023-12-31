import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import UserContext from "../contexts/UserContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState, useContext } from "react";

type JournalHistoryScreenRouteProp = RouteProp<
  RootStackParamList,
  "JournalHistoryScreen"
>;

type JournalHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "JournalHistoryScreen"
>;

type Props = {
  route: JournalHistoryScreenRouteProp;
  navigation: JournalHistoryScreenNavigationProp;
};

type ItemProps = {
  comments: string | undefined;
  date: string;
  img_url: string | undefined;
  routine_id: {
    routine_name: string;
    routine_product: number[];
    skin_type: string;
  };
};

const JournalHistoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { routineId, routineName } = route.params;
  const { userId } = useContext(UserContext);
  const [journalEntries, setJournalEntries] = useState<ItemProps[]>([]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const Item = ({ comments, date, img_url, routine_id }: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.date}>{formatDate(date)}</Text>
      <View style={styles.containerJournalInfo}>
        {img_url ? (
          <View style={styles.containerImg}>
            <Image source={{ uri: img_url }} style={styles.image} />
          </View>
        ) : (
          <View style={styles.containerImg}>
            <Image
              source={require("../../assets/images/placeholder.png")}
              style={styles.image}
            />
          </View>
        
        )}
        <View style={styles.containerComment}>
          <Text style={styles.comment}>{comments}</Text>
        </View>
      </View>
      
    </View>
  );

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(
          `https://nourishskin.herokuapp.com/journal/routine/user/?userid=${userId}&routineid=${routineId}`
        );
        const commentData = await response.json();
        setJournalEntries(commentData);
      } catch (err) {
        console.error(err);
      }
    };
    getHistory();
  }, []);

  useEffect(() => {
    if (journalEntries.length > 0) {
      // setDisplay(displayData());
    }
  }, [journalEntries]);

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backText}>go back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          {routineName} {"\n"}
          <Text style={styles.subTitleText}>Journal History</Text>
        </Text>
        <ScrollView style={styles.scrollView}>
            {journalEntries.map((item, index) => (
              <Item
                key={index}
                date={item.date}
                comments={item.comments}
                img_url={item.img_url}
                routine_id={item.routine_id}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#EEE3CB",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  backText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
    backgroundColor: "white",
    marginBottom: 10,
    marginTop: -5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    paddingBottom: 50,
   
  },
  scrollView: {
    width: "100%"
  }, 
  titleText: {
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 25,
    color: "rgba(1,90,131,255)",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1.5,
  },
  subTitleText: {
    color: "#5A5A5A",
    fontSize: 20,
  },
  item: {
    flex: 1,
    backgroundColor: "#EEE3CB",
    borderWidth: 2,
    borderColor: "rgba(1,90,131,255)",
    // margin: 10,
    width: "100%",
    height: 300,
    alignItems: "center",
    paddingTop: 7,
    // paddingLeft: 3,
    // paddingRight: 3,
    paddingBottom: 15,
    marginTop: 15,

  },
  containerJournalInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // borderWidth: 2,
    // borderColor: "red",
    borderTopWidth: 2,
    borderColor: "rgba(1,90,131,255)",
    width: "100%",
    height: "90%",
    backgroundColor: "white",
  },
  containerComment: {
    width: "50%",
    height: "100%",
    // backgroundColor: "rgba(1,90,131,255)",
    padding: 10,
  },
  containerImg: {
    // backgroundColor: "#EEE3CB",
    width: "50%",
    height: "100%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    // borderWidth: 2,
    // borderColor: "rgba(1,90,131,255)",
    // marginBottom: 10,
  },
  date: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    marginBottom: 10,
    color: "rgba(1,90,131,255)",
  },
  comment: {
    fontFamily: "Lato-BoldItalic",
    fontSize: 15,
  },
});

export default JournalHistoryScreen;
