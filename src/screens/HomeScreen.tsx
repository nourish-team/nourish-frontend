import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
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
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>nourish.</Text>
        <Image
          style={styles.tinyLogo}
          source={require("../../assets/images/nourish_logo.png")}
        />
      </View>
      <View style={styles.line} />
      <Text style={styles.infoText}>
        Hello {userName}... Lorem ipsum, dolor sit amet consectetur adipisicing
        elit. Ipsa modi placeat dolor, obcaecati quod impedit incidunt nesciunt
        deleniti sequi odit aperiam aliquam repellat aliquid numquam
        reprehenderit, quas quae enim repudiandae.
      </Text>
      <View style={styles.line} />
      <View>
        {/* <Text style={styles.infoText}>Your Location: {location}</Text> */}
        <Text>{weatherData?.current?.condition?.text}</Text>
        <Text>Humidity: {weatherData?.current?.humidity}%</Text>
        <Text>Temperature: {weatherData?.current?.temp_c}°C</Text>
        <Text>City: {weatherData?.location?.name}</Text>
        <Text>UV index: {weatherData?.current?.uv}</Text>
        {weatherData?.current?.uv && weatherData.current.uv >= 5 && (
          <Text>Don't forget to add sunscreen to your beauty routine!</Text>
        )}
      </View>
      <Text style={styles.infoText}>browse by skin type</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSkincareTypePress("Acne")}
          >
            <Text style={styles.buttonText}>Acne</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => handleSkincareTypePress("Dry")}
          >
            <Text style={styles.buttonText}>Dry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSkincareTypePress("Oily")}
          >
            <Text style={styles.buttonText}>Oily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => handleSkincareTypePress("Sensitive")}
          >
            <Text style={styles.buttonText}>Sensitive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: "#FFFDD0",
    paddingLeft: 20,
    paddingRight: 20,
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
    color: "rgba(1,90,131,255)",
    marginBottom: 20,
    marginTop: -20,
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(1,90,131,255)",
    marginTop: -10,
  },
  infoText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    color: "rgba(1,90,131,255)",
    lineHeight: 25,
    marginBottom: 30,
    marginTop: 30,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(1,90,131,255)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  buttonMargin: {
    marginLeft: 25,
  },
});

export default HomeScreen;
