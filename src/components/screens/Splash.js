import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Animatable.View animation="bounceIn" style={styles.logoContainer}>
        <Icon name="rocket" size={100} color="#ffffff" />
      </Animatable.View>
      <Animatable.Text animation="fadeIn" delay={500} style={styles.text}>
        uassssssssssssssssssssssssssssssssssss
      </Animatable.Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
  },
  logoContainer: {
    marginBottom: 20,
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  text: {
    fontSize: 36,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});
