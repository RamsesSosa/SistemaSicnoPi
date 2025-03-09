import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 
  StyleSheet, Modal, TouchableOpacity, FlatList 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RegistroEquipoScreen = () => {
  const navigation = useNavigation();
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [consecutivo, setConsecutivo] = useState('');
  const [accesorios, setAccesorios] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const obtenerClientes = async () => {
      const clientes = await AsyncStorage.getItem('clientes');
      if (clientes) {
        setClientesRegistrados(JSON.parse(clientes));
      }
    };
    obtenerClientes();
  }, []);

  const handleSubmit = async () => {
    const equipo = {
      cliente: clienteSeleccionado,
      nombreEquipo,
      marca,
      modelo,
      numeroSerie,
      consecutivo,
      accesorios,
      observaciones,
    };

    try {
      const equiposGuardados = await AsyncStorage.getItem('equipos');
      const equipos = equiposGuardados ? JSON.parse(equiposGuardados) : [];
      equipos.push(equipo);
      await AsyncStorage.setItem('equipos', JSON.stringify(equipos));
      Alert.alert('Éxito', 'Equipo registrado correctamente');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el equipo');
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

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente.nombres);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Equipos</Text>

      <Text>Seleccionar Cliente</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text>{clienteSeleccionado || 'Seleccione un cliente'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={clientesRegistrados}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => seleccionarCliente(item)}>
                <Text>{item.nombres}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Text>Nombre de equipo</Text>
      <TextInput value={nombreEquipo} onChangeText={setNombreEquipo} placeholder="Ingrese el nombre del equipo" style={styles.input} />

      <Text>Marca</Text>
      <TextInput value={marca} onChangeText={setMarca} placeholder="Ingrese la marca del equipo" style={styles.input} />

      <Text>Modelo</Text>
      <TextInput value={modelo} onChangeText={setModelo} placeholder="Ingrese el modelo del equipo" style={styles.input} />

      <Text>Número de Serie</Text>
      <TextInput value={numeroSerie} onChangeText={setNumeroSerie} placeholder="Ingrese el número de serie" style={styles.input} />

      <Text>Consecutivo</Text>
      <TextInput value={consecutivo} onChangeText={setConsecutivo} placeholder="Ingrese el consecutivo" style={styles.input} />

      <Text>Accesorios</Text>
      <TextInput value={accesorios} onChangeText={setAccesorios} placeholder="Ingrese los accesorios" style={styles.input} />

      <Text>Observaciones</Text>
      <TextInput value={observaciones} onChangeText={setObservaciones} placeholder="Ingrese las observaciones" multiline style={styles.input} />

      <Button title="Guardar e Imprimir" onPress={handleSubmit} />
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
  selector: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
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

export default RegistroEquipoScreen;
