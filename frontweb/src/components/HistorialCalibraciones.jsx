import { useState, useEffect } from "react";
import "./HistorialCalibraciones.css"; // Importar el archivo CSS

const HistorialCalibraciones = () => {
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState("");

  // Obtener los equipos y clientes desde la API
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los equipos");
        const data = await response.json();
        setEquiposRegistrados(data);
        setEquiposFiltrados(data); // Mostrar todos los equipos inicialmente
        console.log("Equipos registrados:", data); // Verificar los datos obtenidos
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar los equipos");
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/clientes/");
        if (!response.ok) throw new Error("Error al obtener los clientes");
        const data = await response.json();
        setClientes(data);
        console.log("Clientes registrados:", data); // Verificar los datos obtenidos
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar los clientes");
      }
    };

    fetchEquipos();
    fetchClientes();
  }, []);

  // Función para filtrar los equipos por cliente y consecutivo
  useEffect(() => {
    let filtrados = equiposRegistrados;

    // Filtrar por cliente
    if (clienteSeleccionado) {
      filtrados = filtrados.filter(
        (equipo) => equipo.cliente === Number(clienteSeleccionado) // Convertir a número
      );
    }

    // Filtrar por consecutivo
    if (busquedaConsecutivo) {
      filtrados = filtrados.filter((equipo) =>
        equipo.consecutivo.toLowerCase().includes(busquedaConsecutivo.toLowerCase())
      );
    }

    setEquiposFiltrados(filtrados);
    console.log("Equipos filtrados:", filtrados); // Verificar los equipos filtrados
  }, [clienteSeleccionado, busquedaConsecutivo, equiposRegistrados]);

  // Manejar el cambio en la selección del cliente
  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setClienteSeleccionado(clienteId);
    console.log("Cliente seleccionado:", clienteId); // Verificar el cliente seleccionado
  };

  // Manejar el cambio en el campo de búsqueda de consecutivo
  const handleBusquedaConsecutivoChange = (e) => {
    const consecutivo = e.target.value;
    setBusquedaConsecutivo(consecutivo);
    console.log("Búsqueda por consecutivo:", consecutivo); // Verificar el consecutivo buscado
  };

  return (
    <div className="historial-calibraciones-container">
      <h1>Historial de Calibraciones</h1>

      {/* Filtro de cliente */}
      <div className="filtro-cliente">
        <label htmlFor="cliente">Filtrar por cliente:</label>
        <select
          id="cliente"
          value={clienteSeleccionado}
          onChange={handleClienteChange}
        >
          <option value="">Todos los clientes</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre_cliente}
            </option>
          ))}
        </select>
      </div>

      {/* Buscador por consecutivo */}
      <div className="buscador-consecutivo">
        <label htmlFor="buscar-consecutivo">Buscar por consecutivo:</label>
        <input
          type="text"
          id="buscar-consecutivo"
          placeholder="Ingrese el consecutivo"
          value={busquedaConsecutivo}
          onChange={handleBusquedaConsecutivoChange}
        />
      </div>

      {/* Tabla de equipos */}
      <table className="historial-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Marca</th>
            <th>Consecutivo</th>
            <th>Fecha de Entrada</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length > 0 ? (
            equiposFiltrados.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.nombre_equipo}</td>
                <td>{equipo.marca}</td>
                <td>{equipo.consecutivo}</td>
                <td>{equipo.fecha_entrada || "No disponible"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay registros disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialCalibraciones;