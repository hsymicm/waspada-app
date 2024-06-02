import React, { useEffect, useRef } from "react"
import { View, Animated, Easing } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface TextSkeletonProps {
  isLoading: boolean
  lineWidth?: number
  lineHeight?: number
  numberOfLines?: number
}

const TextSkeleton = ({
  isLoading,
  lineWidth = null,
  lineHeight = 18,
  numberOfLines = 1,
}) => {
  const pulseAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let pulse: any
    if (isLoading) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()
    } else {
      pulseAnimation.setValue(0)
    }

    return () => {
      if (pulse) {
        pulse.stop()
      }
    }
  }, [isLoading, pulseAnimation])

  const animatedStyle = {
    opacity: pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.3],
    }),
  }

  if (!isLoading) {
    return null
  }

  return (
    <View style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: numberOfLines }, (_, index) => (
        <Animated.View
          key={index}
          style={[
            { width: lineWidth || numberOfLines - 1 === index ? "60%" : "100%", height: lineHeight, borderRadius: 4 },
            animatedStyle,
          ]}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ width: "100%", height: "100%", borderRadius: 4 }}
            colors={["#9FA3B8", "#D0D4E3"]}
          />
        </Animated.View>
      ))}
    </View>
  )
}

export default TextSkeleton
