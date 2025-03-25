import { useState, useEffect } from "react";
import "./HistorialCalibraciones.css";

const HistorialCalibraciones = () => {
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los equipos");
        const data = await response.json();
        setEquiposRegistrados(data);
        setEquiposFiltrados(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Hubo un error al cargar los equipos");
        setLoading(false);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/clientes/");
        if (!response.ok) throw new Error("Error al obtener los clientes");
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEquipos();
    fetchClientes();
  }, []);

  useEffect(() => {
    let filtrados = equiposRegistrados;

    if (clienteSeleccionado) {
      filtrados = filtrados.filter(
        (equipo) => equipo.cliente === Number(clienteSeleccionado)
      );
    }

    if (busquedaConsecutivo) {
      filtrados = filtrados.filter((equipo) =>
        equipo.consecutivo
          .toLowerCase()
          .includes(busquedaConsecutivo.toLowerCase())
      );
    }

    setEquiposFiltrados(filtrados);
  }, [clienteSeleccionado, busquedaConsecutivo, equiposRegistrados]);

  const handleClienteChange = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  const handleBusquedaConsecutivoChange = (e) => {
    setBusquedaConsecutivo(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Cargando equipos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-overlay">
        <div className="error-content">
          <div className="error-icon">!</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>Historial de Calibraciones</h1>

        <div className="filters-container">
          <div className="filter-group">
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

          <div className="filter-group">
            <label htmlFor="buscar-consecutivo">Buscar por consecutivo:</label>
            <input
              type="text"
              id="buscar-consecutivo"
              placeholder="Ingrese el consecutivo"
              value={busquedaConsecutivo}
              onChange={handleBusquedaConsecutivoChange}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-scroll-wrapper">
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
                    <td>
                      {equipo.fecha_entrada
                        ? new Date(equipo.fecha_entrada).toLocaleDateString(
                            "es-ES"
                          )
                        : "No disponible"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No hay registros disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialCalibraciones;
