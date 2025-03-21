import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, 
  TextInput, Modal, Button 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const HistorialCalibracionScreen = () => {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [consecutivoBusqueda, setConsecutivoBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Usa useNavigation para acceder a la navegación

  useEffect(() => {
    const obtenerEquipos = async () => {
      const equiposGuardados = await AsyncStorage.getItem('equipos');
      if (equiposGuardados) {
        setEquipos(JSON.parse(equiposGuardados));
      }
    };
    obtenerEquipos();

    const obtenerClientes = async () => {
      const clientesGuardados = await AsyncStorage.getItem('clientes');
      if (clientesGuardados) {
        setClientes(JSON.parse(clientesGuardados));
      }
    };
    obtenerClientes();
  }, []);

  const eliminarEquipo = async (index) => {
    const nuevosEquipos = [...equipos];
    nuevosEquipos.splice(index, 1);
    setEquipos(nuevosEquipos);
    await AsyncStorage.setItem('equipos', JSON.stringify(nuevosEquipos));
  };

  const confirmarEliminacion = (index) => {
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => eliminarEquipo(index) },
      ]
    );
  };

  const filtrarEquipos = () => {
    let equiposFiltrados = equipos;

    if (clienteSeleccionado) {
      equiposFiltrados = equiposFiltrados.filter(equipo => equipo.cliente === clienteSeleccionado);
    }

    if (consecutivoBusqueda) {
      equiposFiltrados = equiposFiltrados.filter(equipo => equipo.consecutivo.includes(consecutivoBusqueda));
    }

    return equiposFiltrados;
  };

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente.nombres);
    setModalVisible(false);
  };

  const navegarAScannerScreen = (equipo) => {
    navigation.navigate('Scanner', { equipo }); // Navega a ScannerScreen y pasa los datos del equipo
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Equipos</Text>

      <Text>Filtrar por Cliente</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(true)}>
        <Text>{clienteSeleccionado || 'Seleccione un cliente'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={clientes}
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

      <Text>Buscar por Consecutivo</Text>
      <TextInput
        value={consecutivoBusqueda}
        onChangeText={setConsecutivoBusqueda}
        placeholder="Ingrese el consecutivo"
        style={styles.input}
      />

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Nombre</Text>
          <Text style={styles.headerCell}>Marca</Text>
          <Text style={styles.headerCell}>Consecutivo</Text>
          <Text style={styles.headerCell}>Acciones</Text>
        </View>
        <FlatList
          data={filtrarEquipos()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => navegarAScannerScreen(item)}> {/* Navega a ScannerScreen */}
              <View style={styles.row}>
                <View style={styles.cell}>
                  <Text>{item.nombreEquipo}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.marca}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.consecutivo}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmarEliminacion(index)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistorialCalibracionScreen;