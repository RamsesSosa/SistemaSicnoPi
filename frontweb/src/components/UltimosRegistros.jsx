import { useState, useEffect, useCallback } from "react";
import "./HistorialCalibraciones.css";

const UltimosRegistros = () => {
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUltimosRegistros = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = "http://127.0.0.1:8000/api/info-equipos/";
      if (page > 1) {
        url += `?page=${page}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Error al obtener los registros");
      const data = await response.json();

      // Procesamos los datos
      const registrosProcesados = (Array.isArray(data) ? data : data.results || []).map(item => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        nombre_equipo: item.nombre_equipo,
        marca: item.marca,
        consecutivo: item.consecutivo,
        fecha_entrada: item.fecha_entrada
      }));

      // Manejo de paginación
      const totalCount = data.count || registrosProcesados.length;
      const totalPages = Math.ceil(totalCount / 15); // 15 equipos por página

      setUltimosRegistros(registrosProcesados);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al cargar los últimos registros");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUltimosRegistros(currentPage);
  }, [currentPage, fetchUltimosRegistros]);

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

  if (loading && ultimosRegistros.length === 0) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Cargando últimos registros...</p>
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
        <h1>Últimos Registros</h1>
        <p className="total-registros">Total de equipos: {totalCount}</p>
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
              {ultimosRegistros.length > 0 ? (
                ultimosRegistros.map((registro) => (
                  <tr key={registro.id}>
                    <td>{registro.nombre_equipo}</td>
                    <td>{registro.marca}</td>
                    <td>{registro.consecutivo}</td>
                    <td>
                      {registro.fecha_entrada
                        ? new Date(registro.fecha_entrada).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
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
    </div>
  );
};

export default UltimosRegistros;