import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleEquipo.css";

const DetalleEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [usuarioActual] = useState(
    localStorage.getItem("currentUser") || "admin@calibraciones.com"
  );
  const [historialEstados, setHistorialEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEstadoNombre = (estadoId) => {
    const estados = {
      1: "Ingreso",
      2: "En espera",
      3: "Calibrando",
      4: "Calibrado",
      5: "Etiquetado",
      6: "Certificado emitido",
      7: "Listo para entrega",
      8: "Entregado",
    };
    return estados[estadoId] || "Ingreso";
  };

  const getEstadoColor = (estadoId) => {
    const colores = {
      1: "#ff9500",
      2: "#a5a5a5",
      3: "#4fc3f7",
      4: "#4a6fa5",
      5: "#16a085",
      6: "#27ae60",
      7: "#2ecc71",
      8: "#16a085",
    };
    return colores[estadoId] || "#cccccc";
  };

  useEffect(() => {
    const cargarDatosEquipo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/equipos/${id}/`
        );
        if (!response.ok) throw new Error("Error al obtener el equipo");
        const data = await response.json();

        const equiposGuardados =
          JSON.parse(localStorage.getItem("equipos")) || {};
        const equipoLocal = equiposGuardados[id];

        const equipoCombinado = equipoLocal
          ? { ...data, estado: equipoLocal.estado || data.estado }
          : data;

        setEquipo(equipoCombinado);

        const historialKey = `historial_${id}`;
        let historial = JSON.parse(localStorage.getItem(historialKey)) || [];

        if (historial.length === 0) {
          const estadoInicial = equipoCombinado.estado || 1;
          const nombreEstado = getEstadoNombre(estadoInicial);

          historial = [
            {
              estado: nombreEstado,
              estadoId: estadoInicial,
              usuario: usuarioActual,
              fecha: new Date().toISOString(),
              accion: "estado_inicial",
            },
          ];
          localStorage.setItem(historialKey, JSON.stringify(historial));
        }

        historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setHistorialEstados(historial);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Hubo un error al cargar los detalles del equipo");
        setLoading(false);
      }
    };

    cargarDatosEquipo();
  }, [id, usuarioActual]);

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
                style={{ backgroundColor: getEstadoColor(equipo.estado) }}
              >
                {getEstadoNombre(equipo.estado)}
              </span>
            </span>
          </div>
        </div>

        <div className="proceso-card">
          <div className="responsable-section">
            <h2>Responsable Actual</h2>
            <div className="info-row">
              <span className="info-label">Usuario:</span>
              <span className="info-value">{usuarioActual}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Fecha/Hora:</span>
              <span className="info-value">
                {new Date().toLocaleString("es-ES")}
              </span>
            </div>
          </div>

          <div className="historial-section">
            <h2>Historial de Estados</h2>
            <div className="historial-list">
              {historialEstados.map((item, index) => (
                <div key={index} className="historial-item">
                  <div className="historial-estado">{item.estado}</div>
                  <div className="historial-details">
                    <span className="historial-usuario">{item.usuario}</span>
                    <span className="historial-fecha">
                      {new Date(item.fecha).toLocaleString("es-ES")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEquipo;
