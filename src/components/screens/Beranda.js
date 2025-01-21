import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.5:3000/api/todos';

export default function DashboardScreen() {
  const [todos, setTodos] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const { token } = JSON.parse(storedToken);
          setToken(token);

          const response = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();
          if (response.ok) {
            setTodos(data.data || []);
            calculateTotal(data.data || []);
          } else {
            Alert.alert('Error', data.message || 'Failed to fetch todos.');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch todos.');
      }
    };

    fetchTodos();
  }, []);

  const calculateTotal = (data) => {
    const total = data.reduce(
      (sum, item) => sum + parseFloat(item.title || 0),
      0
    );
    setTotalAmount(total);
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <View>
        <Text style={styles.todoTitle}>
          Rp {parseFloat(item.title).toLocaleString('id-ID')}
        </Text>
        <Text style={styles.todoDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://cdn.vectorstock.com/i/500p/05/33/batik-culture-on-garuda-silhouette-vector-21850533.jpg',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Header */}
      <LinearGradient
        colors={['#1D3C6D', '#2F7CB6']}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financial Records</Text>
        </View>
        <Text style={styles.balanceText}>
          Total Tabungan: Rp {totalAmount.toLocaleString('id-ID')}
        </Text>
      </LinearGradient>

      {/* Daftar Todos */}
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Daftar Transaksi</Text>
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(item) => item._id}
          style={styles.todoList}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceText: {
    marginTop: 10,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1D3C6D',
    textAlign: 'center',
  },
  todoList: {
    marginTop: 10,
  },
  todoItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 6,
    borderColor: '#3B82F6',
    elevation: 3,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
});
