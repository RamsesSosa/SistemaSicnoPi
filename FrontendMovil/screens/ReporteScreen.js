import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReporteScreen = () => {
  return (
     <View style={styles.container}>
       <Text style={styles.title}>Reporte</Text>
       <Text>Aquí irá el Reporte.</Text>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#f5f5f5',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 20,
   },
 });

export default ReporteScreen;