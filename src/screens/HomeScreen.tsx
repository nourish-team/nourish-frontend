// React Native
import { View, Text } from "react-native";

// Local imports
import { useUser } from "../contexts/UserContext";

export const HomeScreen = () => {
  const { username } = useUser();
  return (
    <View>
      <Text testID="home-title">Home Screen {username}</Text>
    </View>
  );
};
