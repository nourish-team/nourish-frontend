import { TextInput, StyleSheet } from "react-native";

const StyledTextInput = ({ ...props }) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    width: 210,
    height: 50,
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
  },
});

export default StyledTextInput;
