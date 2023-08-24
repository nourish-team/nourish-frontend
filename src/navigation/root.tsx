import { createStackNavigator } from "@react-navigation/stack";
import AuthNav from "./authStack";
import HomeNav from "./homeStack";
import { useAuthentication } from "../../utils/useAuthentication";

const RootNav = () => {
  const { user } = useAuthentication();

  return user ? <HomeNav /> : <AuthNav />;
};

export default RootNav;
