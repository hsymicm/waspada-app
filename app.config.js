module.exports = {
  expo: {
    name: process.env.NODE_ENV === "development" ? "Waspada development" : "Waspada",
    slug: process.env.NODE_ENV === "development" ? "waspada-app-development" : "waspada-app",
    version: "1.0.0",
    extra: {
      eas: {
        projectId: "af1f06cf-44d9-4f1c-98d3-3379b448e520"
      }
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "waspada-app",
    userInterfaceStyle: "dark",
    androidStatusBar: {
      backgroundColor: "#484CFB",
      barStyle: "light-content"
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#484CFB"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      package: process.env.NODE_ENV === "development" ? "com.waspadadev.waspadadev" : "com.waspada.waspada",
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_API_KEY
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#484cfb"
      }
    },
    plugins: [
      "expo-router",
      "react-native-compressor",
      [
        "expo-camera",
        {
          recordAudioAndroid: true
        }
      ],
      [
        "expo-location",
        {
          isAndroidForegroundServiceEnabled: true
        }
      ],
      [
        "expo-media-library",
        {
          isAccessMediaLocationEnabled: true
        }
      ],
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    }
  },

}