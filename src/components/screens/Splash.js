import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Splash({ onFinish }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: 20,
  },
  text: {
    fontSize: 36,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

