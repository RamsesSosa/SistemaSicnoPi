import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 
  StyleSheet 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RegistroClienteScreen = () => {
  const navigation = useNavigation();
  const [nombres, setNombres] = useState('');

  const handleSubmit = async () => {
    if (!nombres.trim()) {
      Alert.alert('Error', 'Por favor, ingrese un nombre válido');
      return;
    }
    const cliente = { nombres };
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

      <Text style={styles.label}>Nombres</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese los nombres"
        value={nombres}
        onChangeText={setNombres}
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
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