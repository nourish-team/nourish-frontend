import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import UserContext from "../contexts/UserContext";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

interface ApiResponse {
  current: CurrentWeather;
  location: Location;
}

interface CurrentWeather {
  cloud: number;
  condition: WeatherCondition;
  feelslike_c: number;
  gust_kph: number;
  humidity: number;
  is_day: number;
  last_updated: string;
  last_updated_epoch: number;
  precip_mm: number;
  temp_c: number;
  uv: number;
  wind_degree: number;
  wind_dir: string;
  wind_kph: number;
}

interface WeatherCondition {
  code: number;
  icon: string;
  text: string;
}

interface Location {
  country: string;
  lat: number;
  localtime: string;
  localtime_epoch: number;
  lon: number;
  name: string;
  region: string;
  tz_id: string;
}

const HomeScreen: React.FC = () => {
  const { userId, userName } = useContext(UserContext);
  const skincareTypes = [
    "acne",
    "dry",
    "oily",
    "sensitive",
    "normal",
    "combination",
  ];
  const [location, setLocation] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<ApiResponse | null>(null);

  const weatherTypes = [
    "hot air",
    "dry air",
    "humid air",
  ];

  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const getLocation = async () => {
    console.log("getting location...");
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocation("unavailable");
      return;
    }

    const userLocation = await Location.getLastKnownPositionAsync({});

    if (userLocation) {
      const { latitude, longitude } = userLocation.coords;
      setLocation(`${latitude}, ${longitude}`);
      console.log(location);
    } else {
      setLocation("unavailable");
      console.log(location);
    }
  };

  const fetchWeatherData = async () => {
    console.log("fetching weather data...");
    const currentDate = new Date();
    const cacheExpirationDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0
    );
    const currentDateTime = currentDate.getTime();
    const cacheExpirationDateTime =
      cacheExpirationDate.getTime() + 24 * 60 * 60 * 1000; // add 24 hours

    try {
      let data;

      if (currentDateTime >= cacheExpirationDateTime) {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=9eb1bd24a3fc487a82504534231406&q=${location}&aqi=no`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
        console.log("Fetched weather data: ", data);

        // Store the weather data in AsyncStorage
        await AsyncStorage.setItem("weatherData", JSON.stringify(data));

        // Update the cache expiration time for the next day
        const nextCacheExpirationDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1, // Increment the day by 1
          0,
          0,
          0
        );
        await AsyncStorage.setItem(
          "cacheExpirationTime",
          nextCacheExpirationDate.getTime().toString()
        );
      } else {
        // Retrieve weather data from AsyncStorage
        const storedData = await AsyncStorage.getItem("weatherData");
        if (storedData) {
          data = JSON.parse(storedData);
          console.log(data);
        }
      }

      setWeatherData(data);
    } catch (error) {
      console.error("Error occurred while fetching weather data: ", error);
    }
  };

  const handleSkincareTypePress = (skincareType: string) => {
    navigation.navigate("SkincareType", { skincareType });
  };

  const handleWeatherTypePress = (weatherType: string) => {
    navigation.navigate("WeatherType", { weatherType });
  };

  const handleTopTenPress = () => {
    navigation.navigate("TopTen");
  }

  const hour =
    parseInt(
      weatherData?.location?.localtime?.split(" ")[1]?.split(":")[0] ?? "",
      10
    ) ?? 0;
  const isDay = hour >= 6 && hour < 18;
  const backgroundImage = isDay
    ? require("../../assets/images/dayBackground.jpg")
    : require("../../assets/images/nightBackground.jpg");

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/nourish-logo-sparkles.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>nourish.</Text>
        </View>
        <View style={styles.leftLine} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.greetContainer}>
          <Text style={styles.greetTitle}>Hello {userName}...</Text>
          <Text style={styles.greetText}>
          Welcome to nourish, your personal companion for achieving healthy and radiant skin. Explore and unleash the potential of your skincare journey with us.
          </Text>
        </View>
        <View style={styles.weatherCardContainer}>
          <ImageBackground
            source={backgroundImage}
            style={styles.weatherImage}
            resizeMode="cover"
          >
            <View style={styles.weatherTextContainer}>
              <Text style={styles.weatherText}>
                {weatherData?.current?.condition?.text}
              </Text>
              <Text style={styles.weatherInfoText}>
                Humidity: {weatherData?.current?.humidity}%
              </Text>
              <Text style={styles.weatherInfoText}>
                Temperature: {weatherData?.current?.temp_c}°C
              </Text>
              <Text style={styles.weatherInfoText}>
                City: {weatherData?.location?.name}
              </Text>
              <Text style={[styles.weatherInfoText, styles.weatherInfoTextLast]}>
                UV index: {weatherData?.current?.uv}
              </Text>
              {weatherData?.current?.uv && weatherData.current.uv >= 5 && (
                <Text style={styles.reminderText}>
                  Don't forget to wear sunscreen!
                </Text>
              )}
            </View>
          </ImageBackground>
        </View>
        <TouchableOpacity onPress={handleTopTenPress} style={styles.topTenContainer}> 
          <Image
          source={require("../../assets/images/topten.png")}
          style={styles.topTenImage}
          resizeMode="contain"
        />
        <Text style={styles.topTenFont}>Top 10 Liked Routines</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹ ⊹</Text>
        <Text style={styles.infoText}>browse by</Text>
        <Text style={styles.infoText}>skin type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardContainer}
        >
          {skincareTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, index !== 0 && styles.cardMargin]}
              onPress={() => handleSkincareTypePress(type)}
            >
              <Text style={styles.cardText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.infoText}>browse by</Text>
        <Text style={styles.infoText}>weather type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardContainer}
        >
          {weatherTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, index !== 0 && styles.cardMargin]}
              onPress={() => handleWeatherTypePress(type)}
            >
              <Text style={styles.cardText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.footerContainer}>
          <Image
            source={require("../../assets/images/footer-shape.png")}
            style={styles.footerImage}
            resizeMode="stretch"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: -440,
  },
  footerContainer: {
    flex: 1,
    zIndex: -1,
    marginLeft: -10,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 90,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  tinyLogo: {
    width: 40,
    height: 40,
    marginTop: -7,
  },
  titleText: {
    textAlign: "left",
    fontSize: 40,
    fontFamily: "PlayfairDisplay-Bold",
    // color: "#967E76",
    color: "rgba(1,90,131,255)",
    marginBottom: 10,
    marginTop: -20,
  },
  leftLine: {
    width: "65%",
    height: 2,
    backgroundColor: "rgba(1,90,131,255)",
    marginTop: -10,
  },
  infoText: {
    textAlign: "right",
    fontSize: 30,
    fontFamily: "PlayfairDisplay-Bold",
    color: "#1B2021",
    lineHeight: 30,
    marginRight: 20,
  },
  cardContainer: {
    flexDirection: "row",
    marginTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 80,
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    width: 150,
    height: 225,
    borderRadius: 10,
    backgroundColor: "#9BABB8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  cardMargin: {
    marginLeft: 10,
  },
  cardText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  greetContainer: {
    backgroundColor: "white",
    borderColor: "rgba(1,90,131,255)",
    borderWidth: 3,
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  greetTitle: {
    fontFamily: "PlayfairDisplay-BoldItalic",
    fontSize: 20,
    marginBottom: 10,
  },
  greetText: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    letterSpacing: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 20,
    right: 10,
    width: "35%",
    height: "25%",
    // opacity: 0.5,
    resizeMode: "cover",
    zIndex: -1,
    marginTop: 10,
  },
  footerImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 100,
    resizeMode: "cover",
    zIndex: -1,
  },
  weatherCardContainer: {
    borderRadius: 10,
    borderColor: "#B7C4CF",
    borderWidth: 5,
    marginTop: 10,
    marginBottom: 30,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginLeft: 20,
    marginRight: 20,
  },
  weatherImage: { 
    width: "100%", 
    borderRadius: 10, 
  },
  weatherTextContainer: {
    padding: 10
  },
  weatherText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    textShadowColor: "#3D5A80",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  weatherInfoText: {
    fontSize: 16,
    fontFamily: "Lato-Bold",
    marginBottom: 5,
    color: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
    textShadowColor: "#3D5A80",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  weatherInfoTextLast: {
    fontSize: 16,
    marginBottom: 10,
    textShadowColor: "#3D5A80",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  reminderText: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay-Bold",
    fontWeight: "bold",
    color: "#153B50",
    padding: 10,
    textShadowColor: "#ffffff",
    textShadowRadius: 15,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    textAlign: "center",
    margin: 20,
  },
  topTenContainer: {
    height: 70,
    borderRadius: 10,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#EEE3CB",
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  topTenFont: {
    textAlign: "center",
    fontFamily: "PlayfairDisplay-Bold",
    fontSize: 23,
    color: "rgba(1,90,131,255)",
  },
  topTenImage: {
    width: 50,
    height: 50,
    marginRight: 20
  },
  separator: {
    textAlign: "center",
    marginBottom: 30,
    color: "rgba(1,90,131,255)",
    fontSize: 20
  }
});

export default HomeScreen;
