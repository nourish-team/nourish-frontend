import Constants from "expo-constants";

const cloudinaryConfig = {
  cloudName: Constants.expoConfig?.extra?.cloudName,
  uploadPreset: Constants.expoConfig?.extra?.uploadPreset,
};

export default cloudinaryConfig;
