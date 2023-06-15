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
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocation("unavailable");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    if (location) {
      const { latitude, longitude } = location.coords;
      setLocation(`${latitude}, ${longitude}`);
    } else {
      setLocation("unavailable");
    }
  };

  const fetchWeatherData = async () => {
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
    const cacheExpirationDateTime = cacheExpirationDate.getTime();

    if (currentDateTime >= cacheExpirationDateTime) {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=9eb1bd24a3fc487a82504534231406&q=${location}&aqi=no`
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        console.log(weatherData);
        // Store the weather data in AsyncStorage
        try {
          await AsyncStorage.setItem("weatherData", JSON.stringify(data));
        } catch (error) {
          console.log("Error saving weather data:", error);
        }
      } else {
        setWeatherData(null);
      }
    } else {
      // Retrieve weather data from AsyncStorage
      try {
        const storedData = await AsyncStorage.getItem("weatherData");
        if (storedData) {
          setWeatherData(JSON.parse(storedData));
        }
      } catch (error) {
        console.log("Error retrieving weather data:", error);
      }
    }
  };

  const handleSkincareTypePress = (skincareType: string) => {
    navigation.navigate("SkincareType", { skincareType });
  };

  console.log(weatherData);

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
          source={require("../../assets/images/home_header.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>nourish.</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.greetContainer}>
          <Text style={styles.greetTitle}>Hello {userName}...</Text>
          <Text style={styles.greetText}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa modi
            placeat dolor, obcaecati quod impedit incidunt nesciunt deleniti
            sequi odit aperiam aliquam repellat aliquid numquam reprehenderit,
            quas quae enim repudiandae.
          </Text>
        </View>
        <View style={styles.weatherCardContainer}>
          <ImageBackground
            source={backgroundImage}
            style={{ width: "100%", borderRadius: 10 }}
            resizeMode="cover"
          >
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
          </ImageBackground>
        </View>
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
        <View style={styles.footerContainer}>
          <Image
            source={require("../../assets/images/footer-shape.jpg")}
            style={styles.footerImage}
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
    marginBottom: -400,
  },
  footerContainer: {
    flex: 1,
    zIndex: -1,
    marginLeft: -10,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 90,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
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
    color: "#967E76",
    marginBottom: 10,
    marginTop: -20,
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(1,90,131,255)",
    marginTop: -10,
  },
  squigglyLine: {
    width: "100%",
    height: 2,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    borderStyle: "dotted",
  },
  infoText: {
    textAlign: "right",
    fontSize: 30,
    fontFamily: "PlayfairDisplay-Bold",
    color: "#1B2021",
    lineHeight: 30,
  },
  cardContainer: {
    flexDirection: "row",
    marginTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  card: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  cardMargin: {
    marginLeft: 10,
  },
  cardText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  greetContainer: {
    backgroundColor: "#EEE3CB",
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
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
    top: 0,
    right: 0,
    width: "80%",
    height: "50%",
    opacity: 0.5,
    resizeMode: "cover",
    zIndex: -1,
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
    marginBottom: 120,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
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
});

export default HomeScreen;
