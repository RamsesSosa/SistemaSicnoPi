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
  const MAX_EQUIPOS_SELECCION = 16;

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los equipos");
        const data = await response.json();
        // Ordenar equipos por fecha de entrada (más recientes primero)
        const equiposOrdenados = data.sort((a, b) => {
          return new Date(b.fecha_entrada) - new Date(a.fecha_entrada);
        });
        setEquiposRegistrados(equiposOrdenados);
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
      } else if (prev.length < MAX_EQUIPOS_SELECCION) {
        return [...prev, equipoId];
      }
      return prev;
    });
  };

  const toggleSeleccionRecientes = () => {
    if (equiposSeleccionados.length > 0) {
      // Si hay elementos seleccionados, deseleccionar todos
      setEquiposSeleccionados([]);
    } else {
      // Si no hay elementos seleccionados, seleccionar los 16 más recientes
      const equiposRecientes = equiposFiltrados.slice(0, MAX_EQUIPOS_SELECCION);
      const idsRecientes = equiposRecientes.map(equipo => equipo.id);
      setEquiposSeleccionados(idsRecientes);
    }
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
        <p>Seleccione los equipos que desea imprimir (máximo {MAX_EQUIPOS_SELECCION})</p>

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

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="imprimir-btn"
            onClick={handleImprimirSeleccionados}
            disabled={equiposSeleccionados.length === 0}
          >
            <i className="fas fa-print"></i> Imprimir Seleccionados (
            {equiposSeleccionados.length}/{MAX_EQUIPOS_SELECCION})
          </button>
          <button
            className="imprimir-btn"
            onClick={toggleSeleccionRecientes}
          >
            <i className="fas fa-check-square"></i> 
            {equiposSeleccionados.length > 0 ? "Deseleccionar Todos" : "Seleccionar Recientes"}
          </button>
          {equiposSeleccionados.length >= MAX_EQUIPOS_SELECCION && (
            <span style={{ color: "#d9534f", marginLeft: "10px" }}>
              Límite de {MAX_EQUIPOS_SELECCION} equipos alcanzado
            </span>
          )}
        </div>
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
                        disabled={
                          !equiposSeleccionados.includes(equipo.id) && 
                          equiposSeleccionados.length >= MAX_EQUIPOS_SELECCION
                        }
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