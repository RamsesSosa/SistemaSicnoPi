import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HistorialCalibraciones.css";

// Cache global que persiste entre montajes del componente
const globalCache = {
  equipos: null,
  clientes: null,
  lastFetch: 0,
  CACHE_DURATION: 30 * 60 * 1000 // 30 minutos de cache
};

const HistorialCalibraciones = () => {
  const navigate = useNavigate();
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const ordenarEquipos = useCallback((equipos, order) => {
    return [...equipos].sort((a, b) => {
      const dateA = new Date(a.fecha_entrada);
      const dateB = new Date(b.fecha_entrada);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, []);

  const fetchEquipos = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/info-equipos/";
      if (page > 1) {
        url += `?page=${page}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los equipos");
      const data = await response.json();
      
      // Asumimos que la API devuelve { results: [], count: X } para paginación
      const equiposData = data.results || data;
      const totalCount = data.count || equiposData.length;
      const totalPages = Math.ceil(totalCount / 15); // 15 equipos por página
      
      setEquiposRegistrados(equiposData);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los equipos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientes = useCallback(async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/clientes/?fields=id,nombre_cliente"
      );
      if (!response.ok) throw new Error("Error al obtener los clientes");
      const data = await response.json();
      setClientes(data.results || data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchEquipos(currentPage);
    fetchClientes();
  }, [currentPage, fetchEquipos, fetchClientes]);

  const equiposFiltrados = useMemo(() => {
    let filtrados = equiposRegistrados;

    if (clienteSeleccionado) {
      filtrados = filtrados.filter(
        (equipo) => equipo.cliente === Number(clienteSeleccionado)
      );
    }

    if (busquedaConsecutivo) {
      filtrados = filtrados.filter((equipo) =>
        String(equipo.consecutivo).toLowerCase().includes(busquedaConsecutivo.toLowerCase())
      );
    }

    return ordenarEquipos(filtrados, sortOrder);
  }, [clienteSeleccionado, busquedaConsecutivo, equiposRegistrados, sortOrder, ordenarEquipos]);

  const handleClienteChange = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  const handleBusquedaConsecutivoChange = (e) => {
    setBusquedaConsecutivo(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  const handleEquipoClick = (equipoId) => {
    navigate(`/equipos/${equipoId}`);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll al inicio de la tabla al cambiar de página
      const tableContainer = document.querySelector('.table-scroll-wrapper');
      if (tableContainer) {
        tableContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Mostrar contenido si tenemos datos
  const showContent = equiposRegistrados.length > 0 || !loading;

  return (
    <div className="historial-container">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Cargando equipos...</p>
        </div>
      )}

      {error && (
        <div className="error-overlay">
          <div className="error-content">
            <div className="error-icon">!</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {showContent && (
        <>
          <div className="historial-header">
            <h1>Historial de Calibraciones</h1>
            <p className="total-registros">Total de equipos: {totalCount}</p>

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
                    <th 
                      className="sortable-header" 
                      onClick={toggleSortOrder}
                    >
                      Fecha de Entrada
                      <span className="sort-indicator">
                        {sortOrder === "desc" ? "↓" : "↑"}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map((equipo) => (
                      <tr 
                        key={equipo.id} 
                        onClick={() => handleEquipoClick(equipo.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{equipo.nombre_equipo}</td>
                        <td>{equipo.marca}</td>
                        <td>{equipo.consecutivo}</td>
                        <td>
                          {equipo.fecha_entrada
                            ? new Date(equipo.fecha_entrada).toLocaleDateString("es-ES")
                            : "No disponible"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-results">
                        {loading ? 'Cargando...' : 'No hay registros disponibles'}
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
        </>
      )}
    </div>
  );
};

export default HistorialCalibraciones;