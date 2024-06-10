module.exports = {
  expo: {
    name: "waspada-app",
    slug: "waspada-app",
    version: "1.0.0",
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID
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
      package: "com.waspada.waspada",
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_API_KEY
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png"
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