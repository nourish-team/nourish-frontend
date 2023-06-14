import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import UserContext from "../contexts/UserContext";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { useEffect, useState, useContext } from "react";

type JournalHistoryScreenRouteProp = RouteProp<
  RootStackParamList,
  "JournalHistoryScreen"
>;

type Props = {
  route: JournalHistoryScreenRouteProp;
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

const JournalHistoryScreen: React.FC<Props> = ({ route }) => {
  const { routineId } = route.params;
  const { userId } = useContext(UserContext);
  const [journalEntries, setJournalEntries] = useState<ItemProps[]>([]);

  const Item = ({ comments, date, img_url, routine_id }: ItemProps) => (
    <View style={styles.item}>
      <Text>{date}</Text>
      <Text>{comments}</Text>
      {img_url && (
        <Image
          source={{ uri: img_url }}
          style={{ width: 100, height: 100 }}
        ></Image>
      )}
    </View>
  );

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:8080/journal/routine/user/?userid=${userId}&routineid=${routineId}`
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
      <Text>Journal History {routineId}</Text>
      <FlatList
        data={journalEntries}
        renderItem={({ item }) => (
          <Item
            date={item.date}
            comments={item.comments}
            img_url={item.img_url}
            routine_id={item.routine_id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#FFFDD0",
    paddingLeft: 20,
    paddingRight: 20,
  },

  item: {
    flex: 1,
    backgroundColor: "#FFFDD0",
    margin: 5,
  },
});

export default JournalHistoryScreen;
