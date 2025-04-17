import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleEquipo.css";

const DetalleEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [historialEstados, setHistorialEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tieneHistorial, setTieneHistorial] = useState(false);

  // Configuración de estados con colores
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

  // Cargar datos del equipo específico
  useEffect(() => {
    const cargarDatosEquipo = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Obtener datos del equipo específico
        const equipoResponse = await fetch(`http://127.0.0.1:8000/api/equipos/${id}/`);
        if (!equipoResponse.ok) throw new Error("Error al obtener el equipo");
        const equipoData = await equipoResponse.json();

        // 2. Obtener historial EXCLUSIVO de este equipo
        const historialResponse = await fetch(
          `http://127.0.0.1:8000/api/historial-equipos/?equipo=${id}`
        );
        if (!historialResponse.ok) throw new Error("Error al obtener el historial");
        const historialData = await historialResponse.json();

        // 3. Procesar solo si hay historial para ESTE equipo
        if (historialData.length > 0) {
          setTieneHistorial(true);
          
          // Ordenar historial por fecha (más reciente primero)
          const historialOrdenado = [...historialData].sort(
            (a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio)
          );

          // Procesar datos del historial
          const historialProcesado = await Promise.all(
            historialOrdenado.map(async (item) => {
              let responsable = "Sistema";
              
              // SOLUCIÓN: Manejo mejorado del responsable
              if (item.responsable) {
                try {
                  const usuarioResponse = await fetch(
                    `http://127.0.0.1:8000/api/usuarios/${item.responsable}/`
                  );
                  if (usuarioResponse.ok) {
                    const usuarioData = await usuarioResponse.json();
                    // Usamos fullName o username como fallback
                    responsable = usuarioData.fullName || 
                                 usuarioData.username || 
                                 `Usuario ${item.responsable}`;
                  }
                } catch (error) {
                  console.error("Error al cargar usuario:", error);
                  responsable = `Usuario ${item.responsable}`;
                }
              }

              const estadoInfo = estadosConfig[item.estado] || estadosConfig[1];

              return {
                estado: estadoInfo.nombre,
                estadoColor: estadoInfo.color,
                usuario: responsable,
                fecha: item.fecha_cambio,
                accion: item.observaciones || "Cambio de estado"
              };
            })
          );

          setHistorialEstados(historialProcesado);
        } else {
          setTieneHistorial(false);
        }

        setEquipo({
          ...equipoData,
          estado: equipoData.estado || 1
        });

        setLoading(false);

      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError(`Error al cargar datos: ${error.message}`);
        setLoading(false);
      }
    };

    cargarDatosEquipo();
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

  const estadoActual = estadosConfig[equipo.estado] || estadosConfig[1];

  return (
    <div className="detalle-equipo-container">
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
            <span className="info-value">
              {equipo.nombre_equipo || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Consecutivo:</span>
            <span className="info-value">
              {equipo.consecutivo || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Marca:</span>
            <span className="info-value">
              {equipo.marca || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Modelo:</span>
            <span className="info-value">
              {equipo.modelo || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">N° Serie:</span>
            <span className="info-value">
              {equipo.numero_serie || "No especificado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Estado Actual:</span>
            <span className="info-value">
              <span
                className="estado-badge"
                style={{ backgroundColor: estadoActual.color }}
              >
                {estadoActual.nombre}
              </span>
            </span>
          </div>
        </div>

        <div className="proceso-card">
          {/* Mostrar historial SOLO si existe para este equipo */}
          {tieneHistorial ? (
            <>
              <div className="responsable-section">
                <h2>Último Responsable</h2>
                <div className="info-row">
                  <span className="info-label">Usuario:</span>
                  <span className="info-value">
                    {historialEstados[0]?.usuario || "No asignado"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha/Hora:</span>
                  <span className="info-value">
                    {historialEstados[0]?.fecha ? 
                      new Date(historialEstados[0].fecha).toLocaleString("es-ES") : 
                      "No disponible"}
                  </span>
                </div>
              </div>

              <div className="historial-section">
                <h2>Historial de Estados</h2>
                <div className="historial-list">
                  {historialEstados.map((item, index) => (
                    <div key={index} className="historial-item">
                      <div 
                        className="historial-estado"
                        style={{ backgroundColor: item.estadoColor }}
                      >
                        {item.estado}
                      </div>
                      <div className="historial-details">
                        <span className="historial-usuario">{item.usuario}</span>
                        <span className="historial-fecha">
                          {new Date(item.fecha).toLocaleString("es-ES")}
                        </span>
                        {item.accion && (
                          <span className="historial-accion">{item.accion}</span>
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
  );
};

export default DetalleEquipo;