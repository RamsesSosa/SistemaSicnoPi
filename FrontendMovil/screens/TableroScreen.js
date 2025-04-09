import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TableroScreen = () => {
  const navigation = useNavigation();
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioActual] = useState('admin@calibraciones.com');

  const estados = [
    { id: 1, nombre: "Ingreso", color: "#ff9500" },
    { id: 2, nombre: "En espera", color: "#a5a5a5" },
    { id: 3, nombre: "Calibrando", color: "#4fc3f7" },
    { id: 4, nombre: "Calibrado", color: "#4a6fa5" },
    { id: 5, nombre: "Etiquetado", color: "#16a085" },
    { id: 6, nombre: "Certificado emitido", color: "#27ae60" },
    { id: 7, nombre: "Listo para entrega", color: "#2ecc71" },
    { id: 8, nombre: "Entregado", color: "#16a085" },
  ];

  const cargarEquiposConHistorial = async () => {
    try {
      // Cargar equipos y clientes en paralelo
      const [equiposRes, clientesRes] = await Promise.all([
        fetch("http://192.168.1.74:8000/api/equipos/"),
        fetch("http://192.168.1.74:8000/api/clientes/")
      ]);

      if (!equiposRes.ok || !clientesRes.ok) throw new Error("Error al obtener datos");

      const [equiposData, clientesData] = await Promise.all([
        equiposRes.json(),
        clientesRes.json()
      ]);

      // Crear mapa de clientes para búsqueda rápida
      const clientesMap = clientesData.reduce((map, cliente) => {
        map[cliente.id] = cliente.nombre_cliente;
        return map;
      }, {});

      // Procesar equipos con información de clientes
      const equiposActualizados = await Promise.all(equiposData.map(async (equipo) => {
        const historialKey = `historial_${equipo.id}`;
        const historialString = await AsyncStorage.getItem(historialKey);
        const historial = historialString ? JSON.parse(historialString) : [];
        
        const ultimoEstado = historial.length > 0 
          ? historial[historial.length - 1].estadoId 
          : equipo.estado || 1;
          
        return {
          ...equipo,
          estado: ultimoEstado,
          clienteNombre: obtenerNombreCliente(equipo, clientesMap)
        };
      }));
      
      setEquipos(equiposActualizados);
      setClientes(clientesData);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los equipos");
      setLoading(false);
    }
  };

  // Función para obtener el nombre del cliente en diferentes formatos
  const obtenerNombreCliente = (equipo, clientesMap) => {
    // Caso 1: El cliente viene como objeto completo
    if (equipo.cliente && typeof equipo.cliente === 'object') {
      return equipo.cliente.nombre_cliente || 'Cliente no especificado';
    }
    
    // Caso 2: Viene el nombre directamente (cliente_nombre)
    if (equipo.cliente_nombre) {
      return equipo.cliente_nombre;
    }
    
    // Caso 3: Viene solo el ID del cliente (equipo.cliente es número/string)
    if (equipo.cliente && clientesMap[equipo.cliente]) {
      return clientesMap[equipo.cliente];
    }
    
    // Caso por defecto
    return 'Cliente no especificado';
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarEquiposConHistorial();
    });

    return unsubscribe;
  }, [navigation]);

  const registrarCambioEstado = async (equipoId, nuevoEstado) => {
    try {
      const historialKey = `historial_${equipoId}`;
      const historialString = await AsyncStorage.getItem(historialKey);
      const historialActual = historialString ? JSON.parse(historialString) : [];
      
      const estadoInfo = estados.find(e => e.id === nuevoEstado) || { nombre: "Ingreso", id: 1 };
      
      const nuevoRegistro = {
        estado: estadoInfo.nombre,
        estadoId: nuevoEstado,
        usuario: usuarioActual,
        fecha: new Date().toISOString(),
        accion: "cambio_estado"
      };

      const nuevoHistorial = [...historialActual, nuevoRegistro];
      await AsyncStorage.setItem(historialKey, JSON.stringify(nuevoHistorial));
      
      const equiposGuardadosString = await AsyncStorage.getItem("equipos");
      const equiposGuardados = equiposGuardadosString ? JSON.parse(equiposGuardadosString) : {};
      equiposGuardados[equipoId] = { ...equiposGuardados[equipoId], estado: nuevoEstado };
      await AsyncStorage.setItem("equipos", JSON.stringify(equiposGuardados));
    } catch (error) {
      console.error("Error al guardar historial:", error);
    }
  };

  const cambiarEstado = async (equipoId, nuevoEstado) => {
    try {
      const updatedEquipos = equipos.map((equipo) =>
        equipo.id === equipoId ? { ...equipo, estado: nuevoEstado } : equipo
      );
      setEquipos(updatedEquipos);
      
      await registrarCambioEstado(equipoId, nuevoEstado);

      const response = await fetch(
        `http://192.168.1.74:8000/api/equipos/${equipoId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el estado");
      
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo actualizar el estado");
      cargarEquiposConHistorial();
    }
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const filteredEquipos = equipos.filter(
    (equipo) =>
      equipo.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipo.consecutivo && equipo.consecutivo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (equipo.clienteNombre && equipo.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const equiposPorEstado = estados.map((estado) => ({
    ...estado,
    equipos: filteredEquipos.filter((equipo) => equipo.estado === estado.id),
  }));

  const handleEquipoClick = (equipoId) => {
    navigation.navigate('DetalleEquipo', { equipoId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando equipos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={cargarEquiposConHistorial}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Equipos en Proceso de Calibración</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar equipo, consecutivo o cliente..."
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
      </View>

      <ScrollView horizontal style={styles.boardContainer}>
        {equiposPorEstado.map((estado) => (
          <View
            key={estado.id}
            style={[styles.statusColumn, { borderTopColor: estado.color }]}
          >
            <View style={styles.columnHeader}>
              <Text style={styles.columnTitle}>{estado.nombre}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{estado.equipos.length}</Text>
              </View>
            </View>
            <ScrollView style={styles.equiposList}>
              {estado.equipos.map((equipo) => (
                <TouchableOpacity
                  key={equipo.id}
                  style={styles.equipoCard}
                  onPress={() => handleEquipoClick(equipo.id)}
                >
                  <View style={styles.equipoHeader}>
                    <Text style={styles.equipoName}>{equipo.nombre_equipo}</Text>
                    {equipo.consecutivo && (
                      <Text style={styles.consecutivo}>#{equipo.consecutivo}</Text>
                    )}
                  </View>
                  <View style={styles.equipoDetails}>
                    <Text>
                      <Text style={styles.detailLabel}>Cliente: </Text>
                      {equipo.clienteNombre || "No especificado"}
                    </Text>
                  </View>
                  <View style={styles.equipoActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        equipo.estado === 1 && styles.disabledBtn
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        cambiarEstado(equipo.id, equipo.estado - 1);
                      }}
                      disabled={equipo.estado === 1}
                    >
                      <Text style={styles.actionBtnText}>◄ Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        equipo.estado === estados.length && styles.disabledBtn
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        cambiarEstado(equipo.id, equipo.estado + 1);
                      }}
                      disabled={equipo.estado === estados.length}
                    >
                      <Text style={styles.actionBtnText}>Siguiente ►</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  boardContainer: {
    flexGrow: 0,
  },
  statusColumn: {
    width: 300,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 8,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  equiposList: {
    maxHeight: '80%',
  },
  equipoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  equipoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  equipoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  consecutivo: {
    fontSize: 14,
    color: '#666',
  },
  equipoDetails: {
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  equipoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  actionBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TableroScreen;