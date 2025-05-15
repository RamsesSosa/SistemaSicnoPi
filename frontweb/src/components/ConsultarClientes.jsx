import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsultarClientes.css";

const ConsultarClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [clienteExpandido, setClienteExpandido] = useState(null);
  const [equiposCliente, setEquiposCliente] = useState([]);
  const [loading, setLoading] = useState({
    clientes: true,
    equipos: false,
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClientes = useCallback(async (page = 1) => {
    try {
      setLoading(prev => ({ ...prev, clientes: true }));
      let url = "http://127.0.0.1:8000/api/clientes/";
      if (page > 1) {
        url += `?page=${page}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener clientes");
      const data = await response.json();
      
      // Asumimos que la API devuelve { results: [], count: X } para paginación
      setClientes(data.results || data);
      
      // Calcular total de páginas basado en el conteo de la API
      if (data.count) {
        const itemsPerPage = data.results?.length || data.length || 15;
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } else {
        setTotalPages(1);
      }
      
      setLoading(prev => ({ ...prev, clientes: false }));
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los clientes");
      setLoading(prev => ({ ...prev, clientes: false }));
    }
  }, []);

  const fetchEquiposCliente = useCallback(async (clienteId) => {
    try {
      setLoading(prev => ({ ...prev, equipos: true }));
      const response = await fetch(
        `http://127.0.0.1:8000/api/clientes/${clienteId}/equipos/`
      );
      if (!response.ok) throw new Error("Error al obtener equipos del cliente");
      const data = await response.json();
      
      setEquiposCliente(data.results || data);
      setLoading(prev => ({ ...prev, equipos: false }));
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los equipos del cliente");
      setLoading(prev => ({ ...prev, equipos: false }));
    }
  }, []);

  useEffect(() => {
    fetchClientes(currentPage);
  }, [currentPage, fetchClientes]);

  const clientesFiltrados = useMemo(() => {
    if (busquedaNombre.trim() === "") {
      return clientes;
    }
    return clientes.filter((cliente) =>
      cliente.nombre_cliente.toLowerCase().includes(busquedaNombre.toLowerCase())
    );
  }, [busquedaNombre, clientes]);

  const handleClienteClick = async (clienteId) => {
    if (clienteExpandido === clienteId) {
      setClienteExpandido(null);
    } else {
      setClienteExpandido(clienteId);
      await fetchEquiposCliente(clienteId);
    }
  };

  const handleBusquedaChange = (e) => {
    setBusquedaNombre(e.target.value);
  };

  const handleEquipoClick = (equipoId, e) => {
    e.stopPropagation();
    navigate(`/equipos/${equipoId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setClienteExpandido(null); // Cerrar cliente expandido al cambiar de página
      // Scroll al inicio de la tabla al cambiar de página
      const tableContainer = document.querySelector('.table-scroll');
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

  if (loading.clientes) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando clientes...</p>
        </div>
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
    <div className="elegant-container">
      <div className="elegant-header">
        <h1 className="elegant-title">Clientes Registrados</h1>
        <div className="elegant-search">
          <div className="search-input-container">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar cliente por nombre..."
              value={busquedaNombre}
              onChange={handleBusquedaChange}
              className="elegant-search-input"
            />
          </div>
        </div>
      </div>

      <div className="elegant-table-container">
        <div className="table-scroll">
          <table className="elegant-table">
            <thead>
              <tr>
                <th className="th-client">Cliente</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <>
                    <tr
                      key={cliente.id}
                      className={`elegant-row ${
                        clienteExpandido === cliente.id ? "active" : ""
                      }`}
                      onClick={() => handleClienteClick(cliente.id)}
                    >
                      <td className="td-client">
                        <div className="client-info">
                          <span className="client-name">
                            {cliente.nombre_cliente}
                          </span>
                          <span
                            className={`expand-icon ${
                              clienteExpandido === cliente.id
                                ? "expanded"
                                : ""
                            }`}
                          >
                            <svg viewBox="0 0 24 24">
                              <path d="M7 10l5 5 5-5z" />
                            </svg>
                          </span>
                        </div>
                      </td>
                    </tr>
                    {clienteExpandido === cliente.id && (
                      <tr className="equipos-row">
                        <td colSpan="1">
                          <div className="equipos-container">
                            <h4 className="equipos-title">
                              Equipos asociados
                            </h4>
                            {loading.equipos ? (
                              <div className="loading-equipos">
                                <div className="small-spinner"></div>
                                <p>Cargando equipos...</p>
                              </div>
                            ) : equiposCliente.length > 0 ? (
                              <div className="equipos-grid">
                                {equiposCliente.map((equipo) => (
                                  <div
                                    key={equipo.id}
                                    className="equipo-card"
                                    onClick={(e) =>
                                      handleEquipoClick(equipo.id, e)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="equipo-header">
                                      <h5 className="equipo-name">
                                        {equipo.nombre_equipo}
                                      </h5>
                                      <span className="equipo-brand">
                                        {equipo.marca} • {equipo.modelo || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="equipo-details">
                                      <div className="detail-item">
                                        <span className="detail-label">
                                          N° Serie:
                                        </span>
                                        <span className="detail-value">
                                          {equipo.numero_serie || "N/A"}
                                        </span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">
                                          Fecha Entrada:
                                        </span>
                                        <span className="detail-value">
                                          {equipo.fecha_entrada
                                            ? new Date(
                                                equipo.fecha_entrada
                                              ).toLocaleDateString()
                                            : "No registrada"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-equipos">
                                <svg viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <p>
                                  No hay equipos registrados para este cliente
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr className="no-results-row">
                  <td colSpan="1">
                    <div className="no-results-content">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      <p>No se encontraron clientes</p>
                    </div>
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

export default ConsultarClientes;