import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./EquiposProceso.css";

const EquiposProceso = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [currentObservation, setCurrentObservation] = useState("");
  const [pendingChange, setPendingChange] = useState(null);

  // Orden de estados (debe coincidir con tu backend)
  const ordenEstados = [
    "Ingreso",
    "En espera",
    "Calibrando",
    "Calibrado",
    "Etiquetado",
    "Certificado emitido",
    "Listo para entrega",
    "Entregado"
  ];

  // Bloquea el botón de atrás
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate("/home", { replace: true });
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  // Función para obtener el token CSRF
  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";
  };

  // Función optimizada para obtener datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [equiposRes, estadosRes, clientesRes, historialRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/equipos/"),
        fetch("http://127.0.0.1:8000/api/estados-calibracion/"),
        fetch("http://127.0.0.1:8000/api/clientes/"),
        fetch("http://127.0.0.1:8000/api/historial-equipos/")
      ]);

      if (!equiposRes.ok || !estadosRes.ok || !clientesRes.ok || !historialRes.ok) {
        throw new Error("Error al cargar datos");
      }

      const [equiposData, estadosData, clientesData, historialData] = await Promise.all([
        equiposRes.json(),
        estadosRes.json(),
        clientesRes.json(),
        historialRes.json()
      ]);

      // Procesar estados manteniendo el orden definido
      const processedEstados = ordenEstados
        .map(nombre => estadosData.find(e => e.nombre_estado === nombre))
        .filter(Boolean);

      // Organizar historial por equipo
      const historialPorEquipo = historialData.reduce((acc, item) => {
        acc[item.equipo] = acc[item.equipo] || [];
        acc[item.equipo].push(item);
        return acc;
      }, {});

      // Procesar equipos con su estado actual y cliente
      const processedEquipos = equiposData.map(equipo => {
        const historialEquipo = (historialPorEquipo[equipo.id] || [])
          .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio));
        
        const estadoActual = historialEquipo[0]?.estado || equipo.estado_actual?.id || processedEstados[0]?.id;
        const cliente = clientesData.find(c => c.id === equipo.cliente) || null;

        return {
          ...equipo,
          estado_actual: estadoActual,
          estado: estadoActual, // Mantener compatibilidad
          cliente_nombre: cliente?.nombre_cliente || "Cliente no asignado",
          fecha_entrada: new Date(equipo.fecha_entrada).toLocaleDateString(),
          historial: historialEquipo
        };
      });

      setEstados(processedEstados);
      setClientes(clientesData);
      setEquipos(processedEquipos);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cambiarEstado = async (equipoId, nuevoEstadoId, direction) => {
    try {
      const token = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`http://127.0.0.1:8000/api/historial-equipos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
          equipo: equipoId,
          estado: nuevoEstadoId,
          responsable: user?.id || 1,
          observaciones: currentObservation || `Cambio ${direction}`,
          fecha_cambio: new Date().toISOString()
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || "Error al cambiar estado");
      }

      // Actualizar el estado local
      const updatedHistorial = await response.json();
      
      setEquipos(prev => prev.map(e => {
        if (e.id === equipoId) {
          return {
            ...e,
            estado_actual: nuevoEstadoId,
            estado: nuevoEstadoId,
            historial: [updatedHistorial, ...e.historial]
          };
        }
        return e;
      }));
  
      setNotification({
        show: true,
        message: "Estado actualizado correctamente",
        type: "success"
      });
    } catch (err) {
      setNotification({
        show: true,
        message: err.message.includes("Usuario no autenticado") 
          ? "Debes iniciar sesión para realizar esta acción" 
          : err.message,
        type: "error"
      });
      
      if (err.message.includes("Usuario no autenticado")) {
        navigate("/login");
      }
    } finally {
      setShowObservationModal(false);
      setCurrentObservation("");
      setPendingChange(null);
      setTimeout(() => setNotification({ show: false }), 3000);
    }
  };

  const handleEstadoChange = (equipoId, currentEstadoId, direction) => {
    const currentIndex = estados.findIndex(e => e.id === currentEstadoId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= estados.length) return;
    
    const nuevoEstado = estados[newIndex];
    if (!nuevoEstado) return;
    
    setPendingChange({ equipoId, nuevoEstadoId: nuevoEstado.id, direction });
    setShowObservationModal(true);
  };

  const confirmEstadoChange = () => {
    if (!pendingChange) return;
    cambiarEstado(
      pendingChange.equipoId,
      pendingChange.nuevoEstadoId,
      pendingChange.direction
    );
  };

  // Función para agrupar equipos por estado
  const getEquiposPorEstado = (estadoId) => {
    return equipos
      .filter(e => e.estado_actual === estadoId)
      .filter(e =>
        e.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.consecutivo.toString().includes(searchTerm) ||
        e.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  if (loading) return <div className="loading-overlay">Cargando datos...</div>;

  if (error) return (
    <div className="error-overlay">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Recargar</button>
    </div>
  );

  return (
    <div className="equipos-proceso-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {showObservationModal && (
        <div className="modal-overlay">
          <div className="observation-modal">
            <h3>Agregar Observaciones (Opcional)</h3>
            <textarea
              value={currentObservation}
              onChange={(e) => setCurrentObservation(e.target.value)}
              placeholder="Ingrese observaciones sobre el cambio de estado..."
            />
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => {
                  setShowObservationModal(false);
                  setCurrentObservation("");
                  setPendingChange(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmEstadoChange}
              >
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-section">
        <h1>Equipos en Proceso de Calibración</h1>
        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar equipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="board-container">
        {estados.map((estado) => {
          const equiposEnEstado = getEquiposPorEstado(estado.id);
          const estadoIndex = estados.findIndex(e => e.id === estado.id);

          return (
            <div key={estado.id} className="status-column">
              <div className="column-header">
                <h3>{estado.nombre_estado}</h3>
                <span className="count-badge">{equiposEnEstado.length}</span>
              </div>
              <div className="equipos-list">
                {equiposEnEstado.map(equipo => (
                  <div 
                    key={equipo.id} 
                    className="equipo-card" 
                    onClick={() => navigate(`/equipos/${equipo.id}`)}
                  >
                    <div className="equipo-header">
                      <h4>{equipo.nombre_equipo}</h4>
                      <p className="consecutivo">#{equipo.consecutivo}</p>
                    </div>
                    <div className="equipo-details">
                      <p><strong>Cliente:</strong> {equipo.cliente_nombre}</p>
                      <p><strong>Entrada:</strong> {equipo.fecha_entrada}</p>
                      {equipo.historial[0]?.observaciones && (
                        <p className="last-observation">
                          <strong>Última observación:</strong> {equipo.historial[0].observaciones}
                        </p>
                      )}
                    </div>
                    <div className="equipo-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEstadoChange(equipo.id, equipo.estado_actual, 'prev'); 
                        }}
                        disabled={estadoIndex <= 0}
                      >
                        ◄ Anterior
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEstadoChange(equipo.id, equipo.estado_actual, 'next'); 
                        }}
                        disabled={estadoIndex >= estados.length - 1}
                      >
                        Siguiente ►
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquiposProceso;