import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.5:3000/api/todos';

export default function MoneyTracker() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTodos(data.data || []);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid amount in numbers.');
      return;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: amount, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) => [result.data, ...prev]);
      setAmount('');
      setDescription('');
      setShowForm(false);
    } else {
      alert(result.message || 'Error adding todo');
    }
  };

  const handleEditTodo = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid amount in numbers.');
      return;
    }

    const response = await fetch(`${API_URL}/${editTodoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: amount, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editTodoId ? { ...todo, title: amount, description } : todo
        )
      );
      setAmount('');
      setDescription('');
      setShowForm(false);
      setEditTodoId(null);
    } else {
      alert(result.message || 'Error editing todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      alert('Error deleting todo');
    }
  };

  const handleCancelEdit = () => {
    setAmount('');
    setDescription('');
    setShowForm(false);
    setEditTodoId(null);
  };

  const totalAmount = todos.reduce((sum, todo) => sum + parseFloat(todo.title || 0), 0);

  return (
    <ImageBackground
      source={{
        uri: 'https://cdn.vectorstock.com/i/500p/05/33/batik-culture-on-garuda-silhouette-vector-21850533.jpg',
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>CATATAN TABUNGAN</Text>

        {showForm ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Amount (Rp)"
              placeholderTextColor="#9CA3AF"
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
            />
            <Button title={editTodoId ? 'Update' : 'Add'} onPress={editTodoId ? handleEditTodo : handleAddTodo} />
            <Button title="Cancel" color="red" onPress={handleCancelEdit} />
          </View>
        ) : (
          <>
            <FlatList
              data={todos}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.todoItem}>
                  <View>
                    <Text style={styles.todoTitle}>
                      Rp {parseFloat(item.title).toLocaleString('id-ID')}
                    </Text>
                    <Text style={styles.todoDescription}>{item.description}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditTodoId(item._id);
                        setAmount(item.title);
                        setDescription(item.description);
                        setShowForm(true);
                      }}
                    >
                      <Icon name="create" size={20} color="#2563EB" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: Rp {totalAmount.toLocaleString('id-ID')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Icon name="add" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay transparan
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFDD00',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFDD00',
  },
  formContainer: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 6,
    borderColor: '#3B82F6',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFDD00',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginTop: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFDD00',
    textAlign: 'center',
  },
});
