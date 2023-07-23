// import "dotenv/config";

export default {
  expo: {
    name: "nourish-frontend",
    slug: "nourish-frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    // ios: {
    //   supportsTablet: true,
    // },
    android: {
      package: "com.oddpharmacy.nourish",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      versionCode: 1,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      cloudName: process.env.CLOUD_NAME,
      uploadPreset: process.env.UPLOAD_PRESET,
      firebaseApiKey: "AIzaSyBXzbWQdcE7rrT92oo2yrm6-DkFHkgDiBM",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "cd7c5c31-ab80-4f09-b322-8735d895f223",
      },
    },
  },
};
