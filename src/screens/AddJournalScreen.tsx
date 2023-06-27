import React, { useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { RootStackParamList } from "../navigation/types";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import PhotoUploadScreen from "./PhotoUploadScreen";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

type AddJournalScreenRouteProp = RouteProp<
  RootStackParamList,
  "AddJournalScreen"
>;

type AddJournalScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddJournalScreen"
>;

type Props = {
  route: AddJournalScreenRouteProp;
  navigation: AddJournalScreenNavigationProp;
};

const AddJournalScreen: React.FC<Props> = ({ route, navigation }) => {
  const { routineId } = route.params;
  const [commentDate, setCommentDate] = useState<Date>(new Date());
  const [image, setImage] = useState("");
  const [dateSelected, setDateSelected] = useState(false);
  const { userId } = useContext(UserContext);
  const [text, onChangeText] = useState("");
  const [isPickerShown, setIsPickerShown] = useState(false);
  const [clickedInputBox, setClickedInputBox] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleShowPicker = () => {
    setIsPickerShown(true);
  };

  const onChange = (
    event: DateTimePickerEvent,
    value: Date = commentDate
  ): void => {
    setCommentDate(value);
    setDateSelected(true);
    setIsPickerShown(false);
  };

  const handleSubmitInfo = async () => {
    const journalData = {
      users_id: userId,
      routines_id: routineId,
      date: commentDate,
      comments: text,
      img_url: image,
    };

    try {
      const response = await fetch("https://nourishskin.herokuapp.com/journal/routine", {
        method: "POST",
        body: JSON.stringify(journalData),
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        alert("Comment successfully made!");
        onChangeText("");
        handleBackPress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backText}>go back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
      <View style={styles.textBubbleContainerLeft}>
          <View style={styles.leftArrow} />
          <View style={styles.textBubbleLeft}>
            <Text style={styles.textBubbleTextLeft}>
              how was your skin today?
            </Text>
          </View>
        </View>
      <View style={styles.dateContainer}>
        <View style={styles.textBubbleContainerLeft}>
            <View style={styles.leftArrow} />
            <View style={[styles.textBubbleLeft, styles.dateBubble]}>
              <Text style={styles.dateBubbleTextLeft}>
              {commentDate && commentDate.toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
            style={styles.dateChangeButton}
            onPress={handleShowPicker}
            >
              <Text style={styles.dateButtonText}>Change Date</Text>
            </TouchableOpacity>
        </View>
      </View>
        <View style={styles.textBubbleContainerRight}>
            <View style={styles.textBubbleRight}>
              <Text style={styles.textBubbleTextRight}>typing...</Text>
            </View>
            <View style={styles.rightArrow} />
        </View>
        {isPickerShown && (
          <DateTimePicker
            testID="dateTimePicker"
            value={commentDate}
            mode="date"
            onChange={onChange}
          />
        )}
        {text.length < 10 && clickedInputBox && (
          <Text style={styles.errorMessage}>
            Minimum 10-character comment required.
          </Text>
        )}
        <View style={styles.commentContainer}>
          <TextInput
            id="comment"
            placeholder="Comment your thoughts here"
            onChangeText={onChangeText}
            onPressIn={() => setClickedInputBox(true)}
            value={text}
            multiline
            maxLength={380}
            style={styles.commentText}
          />
        </View>

        <View style={styles.submitContainer}>
          <View style={styles.photoUpload}>
            <PhotoUploadScreen image={image} setImage={setImage} />
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitInfo}
              disabled={text.length < 10}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  text.length < 10 ? styles.submitButtonDisabled : {},
                ]}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#B7C4CF",
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
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20
  },
  question: {
    margin: 5,
    marginTop: 15,
    fontSize: 20,
  },
  commentContainer: {
    width: 320,
    height: 280,
    backgroundColor: "white",
    borderColor: "#015A83",
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    alignSelf: "center"
  },
  commentText: {
    fontFamily: "Lato-Regular",
    padding: 5,
    fontSize: 15
  },
  photoUpload: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE3CB",
    width: 150,
    height: 35,
    borderRadius: 20,
    borderColor: "transparent",
  },
  textBubbleContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: "auto",
  },
  textBubbleContainerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    marginLeft: "auto",
    marginRight: 40,
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
    transform: [{ rotate: "-270deg" }],
  },
  rightArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: "rgba(1,90,131,255)",
    transform: [{ rotate: "270deg" }],
  },
  textBubbleLeft: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: "#D0D0D0",
    borderRadius: 10,
    maxWidth: "85%",
  },
  textBubbleRight: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: "rgba(1,90,131,255)",
    borderRadius: 10,
    maxWidth: "85%",
  },
  dateBubble: {
    marginRight: 5
  },
  textBubbleTextLeft: {
    fontSize: 17,
    fontFamily: "Lato-Bold",
  },
  dateBubbleTextLeft: {
    fontSize: 17,
    fontFamily: "Lato-Bold",
  },
  textBubbleTextRight: {
    fontSize: 17,
    fontFamily: "Lato-Bold",
    color: "white",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: 'flex-start',
  },
  dateChangeButton: {
    padding: 10,
  },
  dateButtonText: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#015A83"
  },
  submitContainer: {
    flexDirection: "row",
    gap: 5,
    alignSelf: "center",
    marginTop: 10
  },
  submitButton: {
    backgroundColor: "#015A83",
    borderRadius: 30,
    borderColor: "transparent",
    padding: 10,
    paddingHorizontal: 50,
  },
  submitButtonText: {
    fontFamily: "Lato-Bold",
    color: "white"
  },
  submitButtonDisabled: {
    color: "white",
  },
  errorMessage: {
    color: "#A40606",
    fontSize: 12,
    marginTop: 10,
    marginHorizontal: -10,
    textAlign: "center"
  },
});

export default AddJournalScreen;
