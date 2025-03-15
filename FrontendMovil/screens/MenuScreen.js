import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ContenidoScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Contenido Screen</Text>
  </View>
);
const ScannerScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Scanner</Text>
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => navigation.navigate('Contenido')}
    >
      <Text style={styles.buttonText}>Ir a Contenido</Text>
    </TouchableOpacity>
  </View>
);
const TableroScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Tablero</Text>
  </View>
);
const QuickAccess = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Accesos Rápidos</Text>
    <FlatList
      data={[
        { id: '1', name: 'Registrar Cliente', icon: 'person-add', screen: 'RegistroClientes' },
        { id: '2', name: 'Consultar Equipo', icon: 'engineering', screen: 'ConsultaEquipo' },
        { id: '3', name: 'Historial Calibracion', icon: 'history', screen: 'HistorialCalibracion' },
        { id: '4', name: 'Registrar equipo', icon: 'construction', screen: 'RegistroEquipo' },
        { id: '5', name: 'Generar Reporte', icon: 'assessment', screen: 'Reporte' },
      ]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(item.screen)}>
          <View style={styles.quickAccessItem}>
            <MaterialIcons name={item.icon} size={30} color="#FF8F00" />
            <Text style={styles.quickAccessText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  </View>
);
const ScannerStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Scanner" component={ScannerScreen} />
    <Stack.Screen name="Contenido" component={ContenidoScreen} />
  </Stack.Navigator>
);
const MenuScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Menu" component={QuickAccess} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Tablero" component={TableroScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="dashboard" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Scanner" component={ScannerStack} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="qr-code-scanner" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF8F00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  quickAccessText: {
    marginLeft: 10,
    fontSize: 18,
  },
});
export default MenuScreen;