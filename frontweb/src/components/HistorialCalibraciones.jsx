import { useState, useEffect } from "react";
import "./HistorialCalibraciones.css"; // Importar el archivo CSS

const HistorialCalibraciones = () => {
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState(""); // Estado para el consecutivo buscado

  useEffect(() => {
    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    setEquiposRegistrados(equipos);
    setEquiposFiltrados(equipos);

    const clientesRegistrados = JSON.parse(localStorage.getItem("clientes")) || [];
    setClientes(clientesRegistrados);
  }, []);

  // Función para filtrar los equipos por cliente
  const filtrarEquiposPorCliente = (clienteId) => {
    if (clienteId === "") {
      setEquiposFiltrados(equiposRegistrados);
    } else {
      const filtrados = equiposRegistrados.filter(
        (equipo) => equipo.cliente === clienteId
      );
      setEquiposFiltrados(filtrados);
    }
  };

  // Función para filtrar los equipos por consecutivo
  const filtrarEquiposPorConsecutivo = (consecutivo) => {
    if (consecutivo === "") {
      // Si no hay búsqueda, mostrar todos los equipos filtrados por cliente
      filtrarEquiposPorCliente(clienteSeleccionado);
    } else {
      // Filtrar los equipos que coincidan con el consecutivo
      const filtrados = equiposRegistrados.filter((equipo) =>
        equipo.consecutivo.toLowerCase().includes(consecutivo.toLowerCase())
      );
      setEquiposFiltrados(filtrados);
    }
  };

  // Manejar el cambio en la selección del cliente
  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setClienteSeleccionado(clienteId);
    filtrarEquiposPorCliente(clienteId);
  };

  // Manejar el cambio en el campo de búsqueda de consecutivo
  const handleBusquedaConsecutivoChange = (e) => {
    const consecutivo = e.target.value;
    setBusquedaConsecutivo(consecutivo);
    filtrarEquiposPorConsecutivo(consecutivo);
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
            <th>Fecha de Salida</th>
          </tr>
        </thead>
        <tbody>
          {equiposFiltrados.length > 0 ? (
            equiposFiltrados.map((equipo, index) => (
              <tr key={index}>
                <td>{equipo.nombre_equipo}</td>
                <td>{equipo.marca}</td>
                <td>{equipo.consecutivo}</td>
                <td>{equipo.fecha_creacion || "No disponible"}</td>
                <td>{equipo.fecha_salida || "No disponible"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay registros disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialCalibraciones;