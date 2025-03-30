import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ReporteScreen = ({ tiempoCalibracion = "N/A", equiposPendientes = 0, tecnicos = [] }) => {

  const generarPDF = async () => {
    const htmlContent = `
      <h1 style="text-align: center;">Reporte de calibración</h1>
      <p><strong>Tiempo promedio de calibración:</strong> ${tiempoCalibracion}</p>
      <p><strong>Equipos pendientes:</strong> ${equiposPendientes} equipos en espera</p>
      <p><strong>Productividad del Técnico:</strong></p>
      <ul>
        ${tecnicos.map(tecnico => `<li>${tecnico}</li>`).join("")}
      </ul>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (uri) {
        Alert.alert("PDF Generado", "El PDF se ha generado con éxito.");
        compartirPDF(uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo generar el PDF.");
    }
  };

  const compartirPDF = async (filePath) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("Error", "No se puede compartir este archivo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte</Text>
      <View style={styles.reportContainer}>
        <Text style={styles.reportTitle}>Reporte de calibración</Text>
        <Text style={styles.text}>Tiempo promedio de calibración: {tiempoCalibracion}.</Text>
        <Text style={styles.sectionTitle}>Equipos pendientes:</Text>
        <Text style={styles.text}>{equiposPendientes} equipos en espera</Text>
        <Text style={styles.sectionTitle}>Productividad del Técnico:</Text>
        {tecnicos.length > 0 ? (
          tecnicos.map((tecnico, index) => (
            <Text key={index} style={styles.text}>{tecnico}</Text>
          ))
        ) : (
          <Text style={styles.text}>No hay técnicos asignados</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={generarPDF}>
        <Text style={styles.buttonText}>Generar PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reportContainer: {
    width: '90%',
    borderWidth: 1,
    padding: 20,
    borderRadius: 5,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReporteScreen;
