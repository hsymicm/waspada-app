import { useState, useCallback, useMemo, useEffect } from "react"
import { Animated, View, Text, Image, StyleSheet } from "react-native"
import { Colors } from "../themes/Colors"
import { StatusBar } from "expo-status-bar"
import React from "react"

export function AppLoader({ children, isLoaded }) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const animate = useMemo(() => new Animated.Value(1), [])

  useEffect(() => {
    if (isLoaded) {
      Animated.timing(animate, {
        delay: 2000,
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true))
    }
  }, [isLoaded])

  return (
    <>
      <View style={{ flex: 1 }}>
        {isLoaded && children}
        {!animationComplete && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.container,
              { opacity: animate },
            ]}
          >
            <Text style={styles.title}>Waspada.</Text>
            <Text style={styles.paragraph}>
              Aplikasi untuk Melacak dan Melaporkan Kecelakaan
            </Text>
            <Text style={styles.copyright}>Copyright 2024</Text>
            <Image
              style={styles.background}
              source={require("../assets/waspada-bg-accent.png")}
              fadeDuration={300}
            />
          </Animated.View>
        )}
      </View>
      <StatusBar
        translucent
        animated
        backgroundColor={animationComplete ? Colors.white : Colors.accent}
        style={animationComplete ? "dark" : "light"}
      />
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 32,
    color: Colors.white,
  },

  paragraph: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
    width: 240,
  },

  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 32,
    backgroundColor: Colors.accent,
  },

  copyright: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: Colors.white,
    position: "absolute",
    bottom: 48,
    marginHorizontal: "auto",
  },

  background: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
    left: 0,
    top: 0,
  },
})
