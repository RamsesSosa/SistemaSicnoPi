import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const api = axios.create({
  baseURL: 'http://192.168.1.79:8000/api/',
  timeout: 20000,
});
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post('token/', {
        correo: email,
        password: password,
      });

      await AsyncStorage.multiSet([
        ['access_token', response.data.access],
        ['refresh_token', response.data.refresh]
      ]);

      navigation.replace('Menu');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Tiempo de espera agotado. Verifica tu conexión.');
      } else if (error.response?.status === 401) {
        Alert.alert('Error', 'Credenciales incorrectas');
      } else {
        Alert.alert('Error', 'No se pudo conectar al servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido!</Text>
      <Text style={styles.subtitle}>Inicia sesión con tu correo y contraseña.</Text>
      {/* Campo de correo electrónico */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {/* Campo de contraseña */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Alternar visibilidad
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {/* Botón de inicio de sesión personalizado */}
      <TouchableOpacity style={styles.customButton} onPress={handleLogin}>
        <Text style={styles.customButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      {/* Enlace para registrarse */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Registrarse</Text>
      </TouchableOpacity>
      {/* Enlace para recuperar contraseña */}
      <TouchableOpacity>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333', 
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 30,
    backgroundColor: '#fff', 
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333', 
  },
  customButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  customButtonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;