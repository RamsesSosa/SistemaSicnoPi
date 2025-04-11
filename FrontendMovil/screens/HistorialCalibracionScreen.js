import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Modal, ActivityIndicator, Alert, Button 
} from 'react-native';
import axios from 'axios';

const HistorialCalibracionScreen = () => {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [consecutivoBusqueda, setConsecutivoBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.14:8000/api';

  // Función corregida para obtener equipos
  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/equipos`);
      
      // Mapeo corregido usando el campo "cliente" que viene de la API
      const equiposFormateados = response.data.map(equipo => ({
        id: equipo.id,
        nombre_equipo: equipo.nombre_equipo,
        marca: equipo.marca,
        modelo: equipo.modelo,
        numero_serie: equipo.numero_serie,
        consecutivo: equipo.consecutivo,
        accesorios: equipo.accesorios,
        observaciones: equipo.observaciones,
        cliente_id: equipo.cliente, // ¡Aquí está la corrección! Usamos equipo.cliente
        fecha_entrada: equipo.fecha_entrada
      }));
      
      
      setEquipos(equiposFormateados);
    } catch (error) {
      
      Alert.alert('Error', 'No se pudieron cargar los equipos');
    }
  };

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      
      setClientes(response.data.map(cliente => ({
        id: cliente.id,
        nombres: cliente.nombre_cliente
      })));
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Función de filtrado
  const filtrarEquipos = () => {
    if (!clienteSeleccionado) {
      return equipos.filter(equipo => 
        !consecutivoBusqueda || 
        equipo.consecutivo.toLowerCase().includes(consecutivoBusqueda.toLowerCase())
      );
    }

    // Filtramos por cliente seleccionado (usando cliente_id que ahora es correcto)
    const equiposDelCliente = equipos.filter(
      equipo => equipo.cliente_id === clienteSeleccionado.id
    );

    // Filtramos adicionalmente por consecutivo si hay búsqueda
    return equiposDelCliente.filter(equipo => 
      !consecutivoBusqueda || 
      equipo.consecutivo.toLowerCase().includes(consecutivoBusqueda.toLowerCase())
    );
  };

  useEffect(() => {
    fetchEquipos();
    fetchClientes();
  }, []);

  // Renderizado de cada equipo
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre_equipo}</Text>
      <Text style={styles.cell}>{item.marca}</Text>
      <Text style={styles.cell}>{item.consecutivo}</Text>
      <Text style={styles.cell}>
        {new Date(item.fecha_entrada).toLocaleDateString('es-ES')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Calibración</Text>

      {/* Selector de cliente */}
      <Text style={styles.label}>Filtrar por Cliente</Text>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {clienteSeleccionado ? clienteSeleccionado.nombres : 'Todos los clientes'}
        </Text>
      </TouchableOpacity>

      {/* Modal de selección de cliente */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Seleccione un cliente</Text>
          <FlatList
            data={[{id: null, nombres: 'Todos los clientes'}, ...clientes]}
            keyExtractor={item => item.id ? item.id.toString() : 'all'}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item} 
                onPress={() => {
                  setClienteSeleccionado(item.id ? item : null);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.itemText}>{item.nombres}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Búsqueda por consecutivo */}
      <Text style={styles.label}>Buscar por Consecutivo</Text>
      <TextInput
        value={consecutivoBusqueda}
        onChangeText={setConsecutivoBusqueda}
        placeholder="Ingrese el consecutivo"
        style={styles.input}
      />

      {/* Lista de equipos */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Equipo</Text>
        <Text style={styles.headerCell}>Marca</Text>
        <Text style={styles.headerCell}>Consecutivo</Text>
        <Text style={styles.headerCell}>Fecha Entrada</Text>
      </View>
      
      <FlatList
        data={filtrarEquipos()}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No se encontraron equipos</Text>
            {clienteSeleccionado && (
              <Text>para el cliente: {clienteSeleccionado.nombres}</Text>
            )}
          </View>
        }
      />
    </View>
  );
};

// Estilos (se mantienen iguales)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  selectorText: {
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistorialCalibracionScreen;