import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleEquipo.css";

const DetalleEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const estadosConfig = {
    1: { nombre: "Ingreso", color: "#ff9500" },
    2: { nombre: "En espera", color: "#a5a5a5" },
    3: { nombre: "Calibrando", color: "#4fc3f7" },
    4: { nombre: "Calibrado", color: "#4a6fa5" },
    5: { nombre: "Etiquetado", color: "#16a085" },
    6: { nombre: "Certificado emitido", color: "#27ae60" },
    7: { nombre: "Listo para entrega", color: "#2ecc71" },
    8: { nombre: "Entregado", color: "#16a085" }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const [equipoResponse, historialResponse, usuariosResponse] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/equipos/${id}/`),
          fetch(`http://127.0.0.1:8000/api/historial-equipos/?equipo_id=${id}`),
          fetch(`http://127.0.0.1:8000/api/usuarios/`)
        ]);
  
        if (!equipoResponse.ok) throw new Error("Error al cargar el equipo");
        if (!historialResponse.ok) throw new Error("Error al cargar el historial");
        if (!usuariosResponse.ok) throw new Error("Error al cargar los usuarios");
  
        const equipoData = await equipoResponse.json();
        const historialData = await historialResponse.json();
        const usuariosData = await usuariosResponse.json();
  
        const usuariosMap = usuariosData.reduce((map, usuario) => {
          map[usuario.id] = usuario.fullName || `${usuario.firstName} ${usuario.lastName}`;
          return map;
        }, {});
  
        const estadoActualId = equipoData.estado_actual?.id || 1;
        setEquipo({
          ...equipoData,
          estado: estadoActualId
        });
  
        const historialProcesado = historialData
          .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio))
          .map(item => ({
            id: item.id,
            estado: estadosConfig[item.estado]?.nombre || "Desconocido",
            color: estadosConfig[item.estado]?.color || "#000000",
            usuario: usuariosMap[item.responsable] || "Sistema",
            fecha: new Date(item.fecha_cambio).toLocaleString("es-ES"),
            observaciones: item.observaciones || "Cambio de estado"
          }));
  
        setHistorial(historialProcesado);
      } catch (err) {
        setError(`Error: ${err.message}`);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleVolver = () => navigate("/equipos-proceso");

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

  const estadoActual = estadosConfig[equipo.estado] || estadosConfig[1];

  return (
    <div className="detalle-equipo-container">
      <div className="detalle-wrapper">
        <div className="detalle-header">
          <h1 className="detalle-titulo">Detalles del Equipo</h1>
          <button className="volver-btn" onClick={handleVolver} title="Volver">
            &larr;
          </button>
        </div>

        <div className="detalle-grid">
          <div className="info-equipo-card">
            <h2>Información del Equipo</h2>
            <div className="info-row">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{equipo.nombre_equipo || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Consecutivo:</span>
              <span className="info-value">{equipo.consecutivo || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Marca:</span>
              <span className="info-value">{equipo.marca || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Modelo:</span>
              <span className="info-value">{equipo.modelo || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">N° Serie:</span>
              <span className="info-value">{equipo.numero_serie || "No especificado"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Estado Actual:</span>
              <span className="info-value">
                <span className="estado-badge" style={{ backgroundColor: estadoActual.color }}>
                  {estadoActual.nombre}
                </span>
              </span>
            </div>
          </div>

          <div className="proceso-card">
            <h2>Historial de Estados</h2>
            
            {historial.length > 0 ? (
              <>
                <div className="responsable-section">
                  <h3>Último Responsable</h3>
                  <div className="info-row">
                    <span className="info-label">Usuario:</span>
                    <span className="info-value">{historial[0]?.usuario || "No asignado"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Fecha/Hora:</span>
                    <span className="info-value">{historial[0]?.fecha}</span>
                  </div>
                </div>

                <div className="historial-section">
                  <h3>Registro Completo</h3>
                  <div className="historial-list">
                    {historial.map((item) => (
                      <div key={item.id} className="historial-item">
                        <div className="historial-estado" style={{ backgroundColor: item.color }}>
                          {item.estado}
                        </div>
                        <div className="historial-details">
                          <span className="historial-usuario">{item.usuario}</span>
                          <span className="historial-fecha">{item.fecha}</span>
                          {item.observaciones && (
                            <span className="historial-accion">{item.observaciones}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="sin-historial">
                <p>Este equipo no tiene historial registrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEquipo;