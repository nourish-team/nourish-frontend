import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";

const AuthStack = createNativeStackNavigator();

const AuthNav = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNav;
