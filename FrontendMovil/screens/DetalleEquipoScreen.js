import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, Alert, ScrollView, 
  StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegistroEquipoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  const [equipo, setEquipo] = useState(null);
  const [historialEstados, setHistorialEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tieneHistorial, setTieneHistorial] = useState(false);

  // Configuración de estados con colores
  const estadosConfig = {
    1: { nombre: "Ingreso", color: "#ff9500" },
    2: { nombre: "En espera", color: "#a5a5a5" },
    3: { nombre: "Calibrando", color: "#4fc3f7" },
    4: { nombre: "Calibrado", color: "#4a6fa5" },
    5: { nombre: "Etiquetado", color: "#16a085" },
    6: { nombre: "Certificado emitido", color: "#27ae60" },
    7: { nombre: "Listo para entrega", color: "#2ecc71" },
    8: { nombre: "Entregado", color: "#16a085" }
  };

  // Cargar datos del equipo específico
  useEffect(() => {
    const cargarDatosEquipo = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener datos del equipo específico
        const equipoResponse = await fetch(`http://192.168.0.26:8000/api/equipos/${id}/`);
        if (!equipoResponse.ok) throw new Error("Error al obtener el equipo");
        const equipoData = await equipoResponse.json();

        // 2. Obtener historial EXCLUSIVO de este equipo
        const historialResponse = await fetch(
          `http://192.168.0.26:8000/api/historial-equipos/?equipo=${id}`
        );
        if (!historialResponse.ok) throw new Error("Error al obtener el historial");
        const historialData = await historialResponse.json();

        // 3. Procesar solo si hay historial para ESTE equipo
        if (historialData.length > 0) {
          setTieneHistorial(true);
          
          // Ordenar historial por fecha (más reciente primero)
          const historialOrdenado = [...historialData].sort(
            (a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio)
          );

          // Procesar datos del historial
          const historialProcesado = await Promise.all(
            historialOrdenado.map(async (item) => {
              let responsable = "Sistema";
              if (item.responsable) {
                const usuarioResponse = await fetch(
                  `http://192.168.0.26:8000/api/usuarios/${item.responsable}/`
                );
                if (usuarioResponse.ok) {
                  const usuarioData = await usuarioResponse.json();
                  responsable = usuarioData.nombre || "Usuario no encontrado";
                }
              }

              const estadoInfo = estadosConfig[item.estado] || estadosConfig[1];

              return {
                estado: estadoInfo.nombre,
                estadoColor: estadoInfo.color,
                usuario: responsable,
                fecha: item.fecha_cambio,
                accion: item.observaciones || "Cambio de estado"
              };
            })
          );

          setHistorialEstados(historialProcesado);
        } else {
          setTieneHistorial(false);
        }

        setEquipo({
          ...equipoData,
          estado: equipoData.estado || 1
        });

        setLoading(false);

      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(`Error al cargar datos: ${error.message}`);
        setLoading(false);
      }
    };

    if (id) {
      cargarDatosEquipo();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleVolver = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando detalles del equipo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>!</Text>
          <Text>{error}</Text>
          <Button title="Volver" onPress={handleVolver} />
        </View>
      </View>
    );
  }

  if (!equipo && id) {
    return (
      <View style={styles.noEquipoContainer}>
        <Text>No se encontró el equipo solicitado</Text>
        <Button title="Volver" onPress={handleVolver} />
      </View>
    );
  }

  const estadoActual = estadosConfig[equipo?.estado] || estadosConfig[1];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detalles del Equipo</Text>
        <Button title="←" onPress={handleVolver} />
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Equipo</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>
              {equipo?.nombre_equipo || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consecutivo:</Text>
            <Text style={styles.infoValue}>
              {equipo?.consecutivo || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Marca:</Text>
            <Text style={styles.infoValue}>
              {equipo?.marca || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modelo:</Text>
            <Text style={styles.infoValue}>
              {equipo?.modelo || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>N° Serie:</Text>
            <Text style={styles.infoValue}>
              {equipo?.numero_serie || "No especificado"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado Actual:</Text>
            <View style={[styles.estadoBadge, { backgroundColor: estadoActual.color }]}>
              <Text style={styles.estadoBadgeText}>{estadoActual.nombre}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          {/* Mostrar historial SOLO si existe para este equipo */}
          {tieneHistorial ? (
            <>
              <View style={styles.responsableSection}>
                <Text style={styles.cardTitle}>Último Responsable</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Usuario:</Text>
                  <Text style={styles.infoValue}>
                    {historialEstados[0]?.usuario || "No asignado"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha/Hora:</Text>
                  <Text style={styles.infoValue}>
                    {historialEstados[0]?.fecha ? 
                      new Date(historialEstados[0].fecha).toLocaleString("es-ES") : 
                      "No disponible"}
                  </Text>
                </View>
              </View>

              <View style={styles.historialSection}>
                <Text style={styles.cardTitle}>Historial de Estados</Text>
                <View style={styles.historialList}>
                  {historialEstados.map((item, index) => (
                    <View key={index} style={styles.historialItem}>
                      <View 
                        style={[styles.historialEstado, { backgroundColor: item.estadoColor }]}
                      >
                        <Text style={styles.historialEstadoText}>{item.estado}</Text>
                      </View>
                      <View style={styles.historialDetails}>
                        <Text style={styles.historialUsuario}>{item.usuario}</Text>
                        <Text style={styles.historialFecha}>
                          {new Date(item.fecha).toLocaleString("es-ES")}
                        </Text>
                        {item.accion && (
                          <Text style={styles.historialAccion}>{item.accion}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.sinHistorial}>
              <Text>Este equipo no tiene historial registrado</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noEquipoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
  },
  infoValue: {
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },
  estadoBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-end',
  },
  estadoBadgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  responsableSection: {
    marginBottom: 20,
  },
  historialSection: {
    marginTop: 20,
  },
  historialList: {
    marginTop: 10,
  },
  historialItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  historialEstado: {
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  historialEstadoText: {
    color: '#fff',
    fontWeight: '600',
  },
  historialDetails: {
    flex: 1,
  },
  historialUsuario: {
    fontWeight: '600',
    marginBottom: 3,
  },
  historialFecha: {
    color: '#666',
    fontSize: 12,
    marginBottom: 3,
  },
  historialAccion: {
    fontStyle: 'italic',
    color: '#555',
  },
  sinHistorial: {
    padding: 15,
    alignItems: 'center',
  },
});

export default RegistroEquipoScreen;