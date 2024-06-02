import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CardSkeleton = ({ isLoading, firstLoad }) => {
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let pulse: any;
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
      );
      pulse.start();
    } else {
      pulseAnimation.setValue(0); // Reset the animation
    }

    return () => {
      if (pulse) {
        pulse.stop(); // Stop the animation when component is unmounted
      }
    };
  }, [isLoading, pulseAnimation]);

  const animatedStyle = {
    opacity: pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.3],
    }),
  };

  if (!isLoading) {
    return null;
  }

  return (
    <View style={{ display: "flex", gap: 16 }}>
      <Animated.View style={[{ width: '100%', aspectRatio: 1 / 1, borderRadius: 16 }, animatedStyle]}>
        <LinearGradient
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          colors={["#9FA3B8", "#D0D4E3"]}
        />
      </Animated.View>
      {firstLoad && <Animated.View style={[{ width: '100%', aspectRatio: 1 / 1, borderRadius: 16 }, animatedStyle]}>
        <LinearGradient
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          colors={["#9FA3B8", "#D0D4E3"]}
        />
      </Animated.View>}
    </View>
  );
};

export default CardSkeleton;
