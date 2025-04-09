import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 

  StyleSheet, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegistroClienteScreen = () => {
  const navigation = useNavigation();
  const [nombres, setNombres] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombres.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (nombres.length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return;
    }


    setIsLoading(true);
    const cliente = { nombre_cliente: nombres.trim() };


    try {
      const response = await axios.post(
        'http://192.168.1.74:8000/api/clientes/', //cambiar la ip de tu router
        cliente,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Respuesta del servidor:', response);

      if (response.status === 201) {
        Alert.alert('Éxito', 'Cliente registrado correctamente');
        setNombres('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'No se pudo registrar el cliente');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        Alert.alert('Error', error.response.data?.error || 'Error al registrar el cliente');
      } else if (error.request) {
        Alert.alert('Error', 'No se recibió respuesta del servidor');
      } else {
        Alert.alert('Error', 'Error al realizar la solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelar = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.',
      [
        { text: 'No', style: 'cancel' },

        { text: 'Sí', onPress: () => navigation.goBack() }
      ]
    );
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Cliente</Text>

      <Text style={styles.label}>Nombre de la empresa</Text>
      <TextInput
        style={styles.input}
        placeholder="Grupo Bimbo"
        value={nombres}
        onChangeText={setNombres}
      />

      <Button
        title={isLoading ? 'Registrando...' : 'Guardar'}
        onPress={handleSubmit}
        disabled={isLoading}
        color="#4CAF50"
      />
      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      <View style={{ marginVertical: 10 }} />

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