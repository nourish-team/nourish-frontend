import React, { useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { RootStackParamList } from "../navigation/types";
import { RouteProp } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import PhotoUploadScreen from "./PhotoUploadScreen";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";

type AddJournalScreenRouteProp = RouteProp<
  RootStackParamList,
  "AddJournalScreen"
>;
type Props = {
  route: AddJournalScreenRouteProp;
};

const AddJournalScreen: React.FC<Props> = ({ route }) => {
  const { routineId } = route.params;
  const [commentDate, setCommentDate] = useState<Date>(new Date());
  const [image, setImage] = useState("");
  const [dateSelected, setDateSelected] = useState(false);
  const { userId } = useContext(UserContext);
  const [text, onChangeText] = useState("");

  const onChange = (
    event: DateTimePickerEvent,
    value: Date = commentDate
  ): void => {
    setCommentDate(value);
    setDateSelected(true);
  };

  const submitInfo = async () => {
    const journalData = {
      users_id: userId,
      routines_id: routineId,
      date: commentDate,
      comments: text,
      img_url: image,
    };

    try {
      const response = await fetch("http://10.0.2.2:8080/journal/routine", {
        method: "POST",
        body: JSON.stringify(journalData),
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        alert("Comment successfully made!");
        onChangeText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.question}>
        <Text style={styles.question}>How was your skin today?</Text>
      </View>
      <View>
        <Text>selected: {commentDate && commentDate.toLocaleDateString()}</Text>
        {!dateSelected && (
          <DateTimePicker
            testID="dateTimePicker"
            value={commentDate}
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.comment}>
        <TextInput
          id="comment"
          placeholder="Comment here"
          onChangeText={onChangeText}
          value={text}
        />
      </View>
      <View style={styles.photoUpload}>
        <PhotoUploadScreen image={image} setImage={setImage} />
      </View>
      <View>
        <Button title="Submit" onPress={submitInfo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    margin: 5,
    fontSize: 20,
  },
  comment: {
    width: 250,
    height: 100,
    backgroundColor: "lightgrey",
    margin: 20,
  },
  photoUpload: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    width: 250,
    height: 80,
  },
});

export default AddJournalScreen;
