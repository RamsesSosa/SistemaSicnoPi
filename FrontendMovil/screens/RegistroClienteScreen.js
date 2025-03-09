import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RegistroClienteScreen = () => {
  const navigation = useNavigation();
  const [nombres, setNombres] = useState('');
  const [edad, setEdad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');

  const handleSubmit = async () => {
    const cliente = {
      nombres,
      edad,
      fechaNacimiento,
      correo,
      celular,
    };

    try {
      const clientesRegistrados = await AsyncStorage.getItem('clientes');
      const clientes = clientesRegistrados ? JSON.parse(clientesRegistrados) : [];
      clientes.push(cliente);
      await AsyncStorage.setItem('clientes', JSON.stringify(clientes));
      Alert.alert('Éxito', 'Cliente registrado correctamente');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el cliente');
    }
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: () => navigation.navigate('Home') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>

      <Text>Nombres</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese los nombres"
        value={nombres}
        onChangeText={setNombres}
      />

      <Text>Edad</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <Text>Fecha de Nacimiento</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
      />

      <Text>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <Text>Número Celular</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número celular"
        value={celular}
        onChangeText={setCelular}
        keyboardType="phone-pad"
      />

      <Button title="Guardar" onPress={handleSubmit} />
      <Button title="Cancelar" onPress={handleCancelar} color="red" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default RegistroClienteScreen;
