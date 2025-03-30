import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 
  StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegistroEquipoScreen = () => {
  const navigation = useNavigation();
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [consecutivo, setConsecutivo] = useState('');
  const [accesorios, setAccesorios] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener lista de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.0.26:8000/api/clientes/');
        const data = await response.json();
        if (response.ok) {
          setClientes(data);
        } else {
          throw new Error(data.message || 'Error al cargar clientes');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const handleSubmit = async () => {
    if (!clienteSeleccionado) {
      Alert.alert('Error', 'Debe seleccionar un cliente');
      return;
    }

    const equipo = {
      nombre_equipo: nombreEquipo,
      numero_serie: numeroSerie,
      marca: marca,
      modelo: modelo,
      consecutivo: consecutivo,
      accesorios: accesorios,
      observaciones: observaciones,
      cliente: clienteSeleccionado.id,
    };

    try {
      setLoading(true);
      const response = await fetch('http://192.168.0.26:8000/api/equipos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }

      Alert.alert('Éxito', 'Equipo registrado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Error al registrar equipo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && clientes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Equipo</Text>

      {/* Selector de Cliente */}
      <Text style={styles.label}>Cliente*</Text>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setModalVisible(true)}
      >
        <Text>{clienteSeleccionado?.nombre_cliente || 'Seleccione un cliente'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={clientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setClienteSeleccionado(item);
                  setModalVisible(false);
                }}
              >
                <Text>{item.nombre_cliente}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Campos del formulario */}
      <Text style={styles.label}>Nombre del Equipo*</Text>
      <TextInput
        value={nombreEquipo}
        onChangeText={setNombreEquipo}
        style={styles.input}
        placeholder="Ej: Bomba centrífuga"
      />

      <Text style={styles.label}>Número de Serie*</Text>
      <TextInput
        value={numeroSerie}
        onChangeText={setNumeroSerie}
        style={styles.input}
        placeholder="Ej: SN12345678"
      />

      <Text style={styles.label}>Marca*</Text>
      <TextInput
        value={marca}
        onChangeText={setMarca}
        style={styles.input}
        placeholder="Ej: Siemens"
      />

      <Text style={styles.label}>Modelo*</Text>
      <TextInput
        value={modelo}
        onChangeText={setModelo}
        style={styles.input}
        placeholder="Ej: Model X2000"
      />

      <Text style={styles.label}>Consecutivo*</Text>
      <TextInput
        value={consecutivo}
        onChangeText={setConsecutivo}
        style={styles.input}
        placeholder="Ej: C-001-2023"
      />

      <Text style={styles.label}>Accesorios</Text>
      <TextInput
        value={accesorios}
        onChangeText={setAccesorios}
        style={styles.input}
        placeholder="Lista de accesorios incluidos"
      />

      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        value={observaciones}
        onChangeText={setObservaciones}
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Detalles adicionales del equipo"
      />

      <Button 
        title="Registrar Equipo" 
        onPress={handleSubmit} 
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistroEquipoScreen;