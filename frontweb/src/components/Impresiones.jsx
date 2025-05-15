import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const MAX_EQUIPOS_SELECCION = 16;

  const fetchEquipos = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      let url = "http://127.0.0.1:8000/api/impresiones/equipos/";
      if (page > 1) {
        url += `?page=${page}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los equipos");
      const data = await response.json();
      
      // Establecer equipos
      setEquiposRegistrados(data.results || []);
      
      // Extraer clientes únicos de los equipos
      if (data.results) {
        const clientesUnicos = [...new Set(data.results.map(equipo => equipo.cliente))];
        setClientes(clientesUnicos.map(cliente => ({ nombre_cliente: cliente })));
      }

      // Calcular total de páginas
      if (data.count) {
        const itemsPerPage = data.results?.length || 16;
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } else {
        setTotalPages(1);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los equipos");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipos(currentPage);
  }, [currentPage, fetchEquipos]);

  const equiposFiltrados = useMemo(() => {
    let filtrados = equiposRegistrados;

    if (clienteSeleccionado) {
      filtrados = filtrados.filter(
        (equipo) => equipo.cliente === clienteSeleccionado
      );
    }

    if (busquedaConsecutivo) {
      filtrados = filtrados.filter((equipo) =>
        String(equipo.consecutivo).toLowerCase().includes(busquedaConsecutivo.toLowerCase())
      );
    }

    return filtrados;
  }, [clienteSeleccionado, busquedaConsecutivo, equiposRegistrados]);

  const handleClienteChange = (e) => {
    setClienteSeleccionado(e.target.value);
    setCurrentPage(1);
  };

  const handleBusquedaConsecutivoChange = (e) => {
    setBusquedaConsecutivo(e.target.value);
    setCurrentPage(1);
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
      setEquiposSeleccionados([]);
    } else {
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const tableContainer = document.querySelector('.table-scroll-container');
      if (tableContainer) {
        tableContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;
      
      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }
      
      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
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
              {clientes.map((cliente, index) => (
                <option key={index} value={cliente.nombre_cliente}>
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

      <div className="table-scroll-container">
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
            <tbody>
              {equiposFiltrados.length > 0 ? (
                equiposFiltrados.map((equipo) => (
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
                    <td>{equipo.cliente}</td>
                    <td>
                      {equipo.fecha_entrada
                        ? new Date(equipo.fecha_entrada).toLocaleDateString("es-ES")
                        : "No disponible"}
                    </td>
                  </tr>
                ))
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

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            «
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ‹
          </button>
          
          {getPageNumbers().map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            )
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            ›
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default Impresiones;