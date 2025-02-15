// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    // Aquí llama a la API para autenticar al usuario
    console.log('Usuario:', email);
    console.log('Contraseña:', password);
    navigation.navigate('Home'); // Redirige a la pantalla principal después del login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido!!!</Text>
      <Text style={styles.subtitle}>Inicia sesión con tu correo y contraseña.</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Registrarse</Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 30,
  },
  link: {
    color: '#007BFF',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
