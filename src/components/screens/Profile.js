import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

export default function ProfileScreen({ onLogout }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (!tokenData) throw new Error("Token tidak ditemukan");

        const { token } = JSON.parse(tokenData);
        const response = await fetch("http://192.168.1.5:3000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat profil");
        }

        const { data } = await response.json();
        setUserData(data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2464EC" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Gagal memuat profil</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "https://cdn.vectorstock.com/i/500p/05/33/batik-culture-on-garuda-silhouette-vector-21850533.jpg" }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Profil Pengguna
        </Animatable.Text>
        <Animatable.View animation="fadeInUp" delay={200} style={styles.profileCard}>
          <View style={styles.iconContainer}>
            <Icon name="person-circle" size={100} color="#495057" />
          </View>
          <Text style={styles.name}>{userData.username}</Text>
          <Text style={styles.email}>
            <Icon name="mail" size={18} color="#6c757d" /> {userData.email}
          </Text>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={18} color="#495057" />
            <Text style={styles.label}>Member sejak:</Text>
            <Text style={styles.value}>
              {new Date(userData.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Animatable.View>
        <Animatable.View animation="bounceIn" delay={400} style={styles.logoutButton}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.logoutTouchable}
            onPress={onLogout}
          >
            <Icon name="log-out" size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Overlay transparan
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFDD00",
    textAlign: "center",
    marginBottom: 30,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Latar belakang judul
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 8,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 30,
    width: "85%",
  },
  iconContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    marginTop: 10,
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  value: {
    fontSize: 16,
    color: "#495057",
  },
  logoutButton: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  logoutTouchable: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#e63946",
    fontWeight: "bold",
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
  },
});

