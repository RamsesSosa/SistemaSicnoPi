import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Impresiones.css";

const Impresiones = () => {
  const navigate = useNavigate();
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los equipos");
        const data = await response.json();
        setEquiposRegistrados(data);
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

  const handleClienteChange = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  const handleBusquedaConsecutivoChange = (e) => {
    setBusquedaConsecutivo(e.target.value);
  };

  const handleEquipoClick = (equipoId) => {
    navigate(`/equipos/${equipoId}`);
  };

  const toggleSeleccionEquipo = (equipoId) => {
    setEquiposSeleccionados((prev) => {
      if (prev.includes(equipoId)) {
        return prev.filter((id) => id !== equipoId);
      } else {
        return [...prev, equipoId];
      }
    });
  };

  const handleImprimirSeleccionados = () => {
    const equiposParaImprimir = equiposRegistrados.filter((equipo) =>
      equiposSeleccionados.includes(equipo.id)
    );
    navigate("/vista-impresion", { state: { equipos: equiposParaImprimir } });
  };

  const filtrarEquipos = () => {
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

    return filtrados;
  };

  const equiposFiltrados = filtrarEquipos();

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
    <div className="impresiones-container">
      <div className="impresiones-header">
        <h1>Impresiones</h1>
        <p>Seleccione los equipos que desea imprimir</p>

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

        <button
          className="imprimir-btn"
          onClick={handleImprimirSeleccionados}
          disabled={equiposSeleccionados.length === 0}
        >
          <i className="fas fa-print"></i> Imprimir Seleccionados (
          {equiposSeleccionados.length})
        </button>
      </div>

      <div className="table-container">
        <table className="impresiones-table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Equipo</th>
              <th>Marca</th>
              <th>Consecutivo</th>
              <th>Cliente</th>
              <th>Fecha de Entrada</th>
            </tr>
          </thead>
          <tbody className="table-body-scroll">
            {equiposFiltrados.length > 0 ? (
              equiposFiltrados.map((equipo) => {
                const cliente = clientes.find((c) => c.id === equipo.cliente);
                return (
                  <tr key={equipo.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={equiposSeleccionados.includes(equipo.id)}
                        onChange={() => toggleSeleccionEquipo(equipo.id)}
                      />
                    </td>
                    <td
                      onClick={() => handleEquipoClick(equipo.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {equipo.nombre_equipo}
                    </td>
                    <td>{equipo.marca}</td>
                    <td>{equipo.consecutivo}</td>
                    <td>{cliente ? cliente.nombre_cliente : "Desconocido"}</td>
                    <td>
                      {equipo.fecha_entrada
                        ? new Date(equipo.fecha_entrada).toLocaleDateString(
                            "es-ES"
                          )
                        : "No disponible"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No hay registros disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Impresiones;
