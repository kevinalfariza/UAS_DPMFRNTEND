import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground } from "react-native";

export default function LoginScreen({ navigation, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.5:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.data.token);
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://www.utsavpedia.com/wp-content/uploads/2013/06/jiunkpe-ns-patterns_design_elements-2004-41404035-1357-batik_tulis-resource1.jpg" }} // Replace with your batik pattern URL
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: "https://media.istockphoto.com/id/1032577702/id/vektor/ilustrasi-ikon-vektor-dengan-konsep-manajemen-keuangan-menabung-menyumbangkan-uang.jpg?s=170667a&w=0&k=20&c=NfCzlPeZLGvWMr5YpdvRuAAYKOnAb58NvFyWApGJkAM=" }} // Replace with your logo URL
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome </Text>
          <Text style={styles.subtitle}>aplikasi kami membantu kamu dalam mencatat data dalam proses menabung kamu </Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#adb5bd"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#adb5bd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>
              New here? <Text style={styles.registerLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 10,
    marginTop: 40,
  },
  formContainer: {
    flex: 2,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#343a40",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 20,
    color: "#6c757d",
    fontSize: 14,
    textAlign: "center",
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "600",
  },
});
