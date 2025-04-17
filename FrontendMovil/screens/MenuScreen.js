import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const Tab = createBottomTabNavigator();

const QuickAccessScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Accesos Rápidos</Text>
    <FlatList
      data={[
        { id: '1', name: 'Registrar Cliente', icon: 'person-add', screen: 'RegistroClientes' },
        { id: '2', name: 'Consultar Equipo', icon: 'engineering', screen: 'ConsultaEquipo' },
        { id: '3', name: 'Historial Calibracion', icon: 'history', screen: 'HistorialCalibracion' },
        { id: '4', name: 'Registrar equipo', icon: 'construction', screen: 'RegistroEquipo' },
        { id: '5', name: 'Generar Reporte', icon: 'assessment', screen: 'Reporte' },
        { id: '6', name: 'Tablero Tareas', icon: 'dashboard', screen: 'Tablero' },
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


const QRScannerScreen = ({ navigation }) => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'Código QR escaneado',
      data,
      [
        {
          text: 'OK',
          onPress: () => setScanned(false),
        },
        {
          text: 'Ver detalles',
          onPress: () => navigation.navigate('ScannerContent', { qrData: data }),
        },
      ],
      { cancelable: false }
    );
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedContainer} />
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
      </CameraView>
    </View>
  );
};

const ContenidoScreen = ({ route }) => {
  const { qrData } = route.params || {};
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contenido del QR</Text>
      <Text style={styles.scannedData}>{qrData || 'No hay datos escaneados'}</Text>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={QuickAccessScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="QRScanner" 
        component={QRScannerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" color={color} size={size} />
          ),
          tabBarLabel: 'Escaner'
        }} 
      />
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
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    borderColor: 'rgba(255,143,0,0.5)',
    borderWidth: 2,
    borderRadius: 10,
  },
  scannedData: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default MainTabNavigator;