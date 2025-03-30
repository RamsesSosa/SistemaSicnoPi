import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

const initialTasks = {
  planned: [
    { id: '1', title: 'Diseñar UI', status: 'Planned' },
    { id: '2', title: 'Definir arquitectura', status: 'Planned' },
  ],
  inProgress: [
    { id: '3', title: 'Crear componentes React Native', status: 'In Progress' },
  ],
  done: [
    { id: '4', title: 'Configurar API', status: 'Done' },
  ],
};

const statuses = [
  'Ingreso',
  'En espera',
  'Calibrando',
  'Calibrado',
  'Etiquetado',
  'Certificado emitido',
  'Lista para entrega',
  'Entregado',
];

const TableroScreen = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const moveTask = (taskId, fromColumn, toColumn) => {
    const fromTasks = [...tasks[fromColumn]];
    const toTasks = [...tasks[toColumn]];
    const task = fromTasks.find(t => t.id === taskId);
    fromTasks.splice(fromTasks.indexOf(task), 1);
    toTasks.push(task);

    setTasks({
      ...tasks,
      [fromColumn]: fromTasks,
      [toColumn]: toTasks,
    });
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setSelectedStatus(task.status);
    setModalVisible(true);
  };

  const updateTaskStatus = () => {
    if (selectedTask) {
      const updatedTasks = { ...tasks };
      Object.keys(updatedTasks).forEach((column) => {
        updatedTasks[column] = updatedTasks[column].map((task) =>
          task.id === selectedTask.id ? { ...task, status: selectedStatus } : task
        );
      });
      setTasks(updatedTasks);
    }
    setModalVisible(false);
  };

  const renderTask = (task, column) => (
    <View style={styles.task}>
      <TouchableOpacity onPress={() => openTaskDetails(task)}>
        <Text style={styles.taskText}>{task.title}</Text>
      </TouchableOpacity>
      <Text style={styles.status}>{task.status}</Text>
      {column !== 'done' && (
        <TouchableOpacity
          style={[styles.moveButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => moveTask(task.id, column, column === 'planned' ? 'inProgress' : 'done')}
        >
          <Text style={styles.moveButtonText}>Mover</Text>
        </TouchableOpacity>
      )}
      {column !== 'planned' && (
        <TouchableOpacity
          style={[styles.moveButton, { backgroundColor: '#FF9800' }]}
          onPress={() => moveTask(task.id, column, column === 'done' ? 'inProgress' : 'planned')}
        >
          <Text style={styles.moveButtonText}>Regresar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tablero de Tareas</Text>
      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.board}>
          {Object.keys(tasks).map((column) => (
            <View key={column} style={styles.column}>
              <Text style={styles.columnTitle}>{column.toUpperCase()}</Text>
              <FlatList
                data={tasks[column]}
                renderItem={({ item }) => renderTask(item, column)}
                keyExtractor={(item) => item.id}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Actualizar Estado</Text>
          <Text style={styles.label}>Tarea: {selectedTask?.title}</Text>
          <Text style={styles.label}>Estado actual: {selectedTask?.status}</Text>
          
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.radioContainer}
              onPress={() => setSelectedStatus(status)}
            >
              <View style={[styles.radioButton, selectedStatus === status && styles.radioSelected]} />
              <Text style={styles.radioText}>{status}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.updateButton} onPress={updateTaskStatus}>
            <Text style={styles.buttonText}>Actualizar estado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  scrollView: { flexGrow: 0 },
  board: { flexDirection: 'row' },
  column: { width: 250, backgroundColor: '#ddd', padding: 10, margin: 5, borderRadius: 8, minHeight: 400 },
  columnTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  task: { backgroundColor: '#fff', padding: 15, marginVertical: 5, borderRadius: 5, alignItems: 'center' },
  taskText: { fontSize: 16, fontWeight: '600' },
  status: { fontSize: 12, color: 'gray' },
  moveButton: { padding: 15, borderRadius: 8, marginVertical: 5, alignItems: 'center', width: '80%' },
  moveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  radioContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'gray', marginRight: 10 },
  radioSelected: { backgroundColor: 'gray' },
  radioText: { fontSize: 16 },
  updateButton: { backgroundColor: '#fdbf00', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  closeButton: { backgroundColor: '#d9534f', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
});

export default TableroScreen;