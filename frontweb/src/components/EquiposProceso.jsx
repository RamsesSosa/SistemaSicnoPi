import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EquiposProceso.css";

const EquiposProceso = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [currentObservation, setCurrentObservation] = useState("");
  const [pendingChange, setPendingChange] = useState({
    equipoId: null,
    nuevoEstadoId: null,
    direction: null
  });

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

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";
  };

  const fetchData = async (url) => {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [estadosData, usuariosData, clientesData, equiposData, historialData] = await Promise.all([
          fetchData("http://127.0.0.1:8000/api/estados-calibracion/"),
          fetchData("http://127.0.0.1:8000/api/usuarios/"),
          fetchData("http://127.0.0.1:8000/api/clientes/"),
          fetchData("http://127.0.0.1:8000/api/equipos/"),
          fetchData("http://127.0.0.1:8000/api/historial-equipos/")
        ]);

        const processedEstados = ordenEstados
          .map(nombre => estadosData.find(e => e.nombre_estado === nombre))
          .filter(Boolean)
          .map(estado => ({
            id: estado.id,
            nombre: estado.nombre_estado,
            orden: estado.orden
          }));

        const historialPorEquipo = historialData.reduce((acc, item) => {
          acc[item.equipo_id] = acc[item.equipo_id] || [];
          acc[item.equipo_id].push(item);
          return acc;
        }, {});

        const processedEquipos = equiposData.map((equipo) => {
          const historialEquipo = (historialPorEquipo[equipo.id] || [])
            .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio));

          const clienteId = equipo.cliente_id || equipo.cliente;
          const cliente = clienteId ? clientesData.find(c => c.id === clienteId) : null;

          const ultimoHistorial = historialEquipo[0] || {};
          const responsableObj = usuariosData.find(u => u.id === ultimoHistorial.responsable_id) || usuariosData[0];

          return {
            ...equipo,
            cliente_id: clienteId,
            cliente_nombre: cliente?.nombre_cliente || `Cliente ID: ${clienteId || 'N/A'}`,
            responsable: responsableObj?.fullName || "Responsable por asignar",
            estado: ultimoHistorial.estado_id || processedEstados.find(e => e.nombre === "Ingreso")?.id || 1,
            fecha_entrada: new Date(equipo.fecha_entrada).toLocaleDateString(),
            historial: historialEquipo
          };
        });

        setEstados(processedEstados);
        setUsuarios(usuariosData);
        setClientes(clientesData);
        setEquipos(processedEquipos);
        setLoading(false);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleEstadoChange = (equipoId, nuevoEstadoId, direction) => {
    if (!nuevoEstadoId) return;
    setPendingChange({ equipoId, nuevoEstadoId, direction });
    setShowObservationModal(true);
  };

  const confirmEstadoChange = async () => {
    try {
      const { equipoId, nuevoEstadoId, direction } = pendingChange;
      const estadoExistente = estados.find(e => e.id === nuevoEstadoId);
      if (!estadoExistente) throw new Error("Estado no encontrado.");

      const usuario = usuarios[0] || {
        id: 1,
        fullName: "Sistema Automático",
        correo: "sistema@calibraciones.com"
      };

      const payload = {
        equipo: equipoId,
        estado: nuevoEstadoId,
        responsable: usuario.id,
        fecha_cambio: new Date().toISOString(),
        observaciones: currentObservation || (direction === 'next' ? 'Cambio siguiente' : 'Cambio anterior')
      };

      const response = await fetch("http://127.0.0.1:8000/api/historial-equipos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      const responseData = await response.json();

      setEquipos(prev =>
        prev.map(e =>
          e.id === equipoId
            ? {
                ...e,
                estado: nuevoEstadoId,
                responsable: usuario.fullName,
                historial: [{ ...responseData, responsable_nombre: usuario.fullName }, ...e.historial]
              }
            : e
        )
      );

      setNotification({ show: true, message: `Estado cambiado a ${estadoExistente.nombre} correctamente`, type: "success" });
      setShowObservationModal(false);
      setCurrentObservation("");
      setPendingChange({ equipoId: null, nuevoEstadoId: null, direction: null });

      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    } catch (err) {
      setNotification({ show: true, message: `Error al cambiar estado: ${err.message}`, type: "error" });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
    }
  };

  if (loading) return <div className="loading-overlay">Cargando datos...</div>;

  if (error)
    return (
      <div className="error-overlay">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );

  return (
    <div className="equipos-proceso-container">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

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
              <button className="cancel-button" onClick={() => { setShowObservationModal(false); setCurrentObservation(""); }}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmEstadoChange}>
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
        {estados.map((estado, index) => {
          const equiposEnEstado = equipos
            .filter(e => e.estado === estado.id)
            .filter(e =>
              e.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.consecutivo.toString().includes(searchTerm) ||
              e.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );

          return (
            <div key={estado.id} className="status-column">
              <div className="column-header">
                <h3>{estado.nombre}</h3>
                <span className="count-badge">{equiposEnEstado.length}</span>
              </div>
              <div className="equipos-list">
                {equiposEnEstado.map(equipo => {
                  return (
                    <div key={equipo.id} className="equipo-card" onClick={() => navigate(`/equipos/${equipo.id}`)}>
                      <div className="equipo-header">
                        <h4>{equipo.nombre_equipo}</h4>
                        <p className="consecutivo">#{equipo.consecutivo}</p>
                      </div>
                      <div className="equipo-details">
                        <p><strong>Cliente:</strong> {equipo.cliente_nombre}</p>
                        <p><strong>Responsable:</strong> {equipo.responsable}</p>
                        <p><strong>Entrada:</strong> {equipo.fecha_entrada}</p>
                      </div>
                      <div className="equipo-actions">
                        <button
                          className="action-btn"
                          onClick={(e) => { e.stopPropagation(); handleEstadoChange(equipo.id, estados[index - 1]?.id, 'prev'); }}
                          disabled={index <= 0}
                        >
                          ◄ Anterior
                        </button>
                        <button
                          className="action-btn"
                          onClick={(e) => { e.stopPropagation(); handleEstadoChange(equipo.id, estados[index + 1]?.id, 'next'); }}
                          disabled={index >= estados.length - 1}
                        >
                          Siguiente ►
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquiposProceso;
