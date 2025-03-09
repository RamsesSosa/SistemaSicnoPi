const TableroScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Tablero de Control</Text>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Indicador 1</Text>
      <Text style={styles.cardValue}>100</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Indicador 2</Text>
      <Text style={styles.cardValue}>200</Text>
    </View>
    {/* Aquí puedes agregar más gráficos, tablas o elementos interactivos */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FF8F00',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: 'white',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});
