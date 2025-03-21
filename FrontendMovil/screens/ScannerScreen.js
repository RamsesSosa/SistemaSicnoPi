// ScannerScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScannerScreen = ({ route }) => {
  const { equipo } = route.params; // Obtén los datos del equipo seleccionado

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Equipo</Text>
      <Text style={styles.text}><Text style={styles.bold}>Nombre:</Text> {equipo.nombreEquipo}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Marca:</Text> {equipo.marca}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Modelo:</Text> {equipo.modelo}</Text>
      <Text style={styles.text}><Text style={styles.bold}>No. Serie:</Text> {equipo.numeroSerie}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Consecutivo:</Text> {equipo.consecutivo}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Accesorios:</Text> {equipo.accesorios}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Observaciones:</Text> {equipo.observaciones}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Cliente:</Text> {equipo.cliente}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Fecha:</Text> {equipo.fechaHora}</Text>
    </View>
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
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ScannerScreen;