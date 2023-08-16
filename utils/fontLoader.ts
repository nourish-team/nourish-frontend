import * as Font from "expo-font";

export const loadFonts = async () => {
  return Font.loadAsync({
    "PlayfairDisplay-Black": require("../assets/fonts/PlayfairDisplay-Black.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    "PlayfairDisplay-BoldItalic": require("../assets/fonts/PlayfairDisplay-BoldItalic.ttf"),
    "PlayfairDisplay-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Bold.ttf"),
    "Lato-Regular": require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-BoldItalic": require("../assets/fonts/Lato-BoldItalic.ttf"),
  });
};
