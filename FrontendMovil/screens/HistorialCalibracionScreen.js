import React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HistorialCalibracionScreen = ({ navigation }) => {
  return (
     <View style={styles.container}>
       <Text style={styles.title}>Historial</Text>
       <Text>Aquí irá el Historial calibrado.</Text>
       <TouchableOpacity 
         style={styles.button} 
         onPress={() => navigation.navigate('ActualizarEquipo')}
       >
         <Text style={styles.buttonText}>Actualizar</Text>
       </TouchableOpacity>
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
   button: {
     marginTop: 20,
     backgroundColor: '#FF8F00',
     padding: 10,
     borderRadius: 5,
   },
   buttonText: {
     color: '#fff',
     fontSize: 18,
   }
});
export default HistorialCalibracionScreen;