import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleEquipo.css";

const DetalleEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/equipos/${id}/`);
        if (!response.ok) throw new Error("Error al obtener el equipo");
        const data = await response.json();
        setEquipo(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Hubo un error al cargar los detalles del equipo");
        setLoading(false);
      }
    };

    fetchEquipo();
  }, [id]);

  const handleVolver = () => {
    navigate("/equipos-proceso");
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Cargando detalles del equipo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-overlay">
        <div className="error-content">
          <div className="error-icon">!</div>
          <p>{error}</p>
          <button onClick={handleVolver}>Volver</button>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="no-equipo">
        <p>No se encontró el equipo solicitado</p>
        <button onClick={handleVolver}>Volver</button>
      </div>
    );
  }

  return (
    <div className="detalle-equipo-container" style={{ overflowY: 'auto', height: '100vh' }}>
      <div className="detalle-header">
        <h1>Detalles del Equipo</h1>
        <button className="volver-btn" onClick={handleVolver}>
          &larr; Volver al listado
        </button>
      </div>

      <div className="equipo-info-card">
        <div className="equipo-info-header">
          <h2>{equipo.nombre_equipo}</h2>
          <span className="consecutivo">#{equipo.consecutivo}</span>
        </div>

        <div className="equipo-info-grid">
          <div className="info-section">
            <h3>Información del Equipo</h3>
            <div className="info-row">
              <span className="info-label">Marca:</span>
              <span className="info-value">{equipo.marca || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Modelo:</span>
              <span className="info-value">{equipo.modelo || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Número de serie:</span>
              <span className="info-value">{equipo.numero_serie || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Accesorios:</span>
              <span className="info-value">{equipo.accesorios || "No especificado"}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Datos del Cliente</h3>
            <div className="info-row">
              <span className="info-label">Cliente:</span>
              <span className="info-value">{equipo.cliente_nombre || "No especificado"}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Fechas</h3>
            <div className="info-row">
              <span className="info-label">Fecha de entrada:</span>
              <span className="info-value">
                {equipo.fecha_entrada ? new Date(equipo.fecha_entrada).toLocaleDateString("es-ES") : "No disponible"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Fecha de salida:</span>
              <span className="info-value">
                {equipo.fecha_salida ? new Date(equipo.fecha_salida).toLocaleDateString("es-ES") : "No disponible"}
              </span>
            </div>
          </div>

          <div className="info-section">
            <h3>Otros Datos</h3>
            <div className="info-row">
              <span className="info-label">Consecutivo:</span>
              <span className="info-value">{equipo.consecutivo || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Observaciones:</span>
              <span className="info-value">{equipo.observaciones || "No hay observaciones"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEquipo;