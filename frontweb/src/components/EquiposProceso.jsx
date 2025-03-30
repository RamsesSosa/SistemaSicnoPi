import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EquiposProceso.css";

const EquiposProceso = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const estados = [
    { id: 1, nombre: "Ingreso", color: "#ff9500" },
    { id: 2, nombre: "En espera", color: "#a5a5a5" },
    { id: 3, nombre: "Calibrando", color: "#4fc3f7" },
    { id: 4, nombre: "Calibrado", color: "#4a6fa5" },
    { id: 5, nombre: "Etiquetado", color: "#16a085" },
    { id: 6, nombre: "Certificado emitido", color: "#27ae60" },
    { id: 7, nombre: "Listo para entrega", color: "#2ecc71" },
    { id: 8, nombre: "Entregado", color: "#16a085" },
  ];

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

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los equipos");
        const data = await response.json();
        const equiposConEstado = data.map((equipo) => ({
          ...equipo,
          estado: equipo.estado || 1,
        }));
        setEquipos(equiposConEstado);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Hubo un error al cargar los equipos");
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEquipos = equipos.filter(
    (equipo) =>
      equipo.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.consecutivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipo.cliente_nombre &&
        equipo.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const equiposPorEstado = estados.map((estado) => ({
    ...estado,
    equipos: filteredEquipos.filter((equipo) => equipo.estado === estado.id),
  }));

  const cambiarEstado = async (equipoId, nuevoEstado) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/equipos/${equipoId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el estado");

      const updatedEquipos = equipos.map((equipo) =>
        equipo.id === equipoId ? { ...equipo, estado: nuevoEstado } : equipo
      );
      setEquipos(updatedEquipos);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEquipoClick = (equipoId) => {
    navigate(`/equipos/${equipoId}`);
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
    <div
      className="equipos-proceso-container"
      style={{ overflowY: "auto", height: "100vh" }}
    >
      <div className="header-section">
        <h1>Equipos en Proceso de Calibración</h1>
        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar equipo, consecutivo o cliente..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="board-container">
        {equiposPorEstado.map((estado) => (
          <div
            key={estado.id}
            className="status-column"
            style={{ borderTopColor: estado.color }}
          >
            <div className="column-header">
              <h3>{estado.nombre}</h3>
              <div className="count-badge">{estado.equipos.length}</div>
            </div>
            <div className="equipos-list">
              {estado.equipos.map((equipo) => (
                <div
                  key={equipo.id}
                  className="equipo-card"
                  onClick={() => handleEquipoClick(equipo.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="equipo-header">
                    <h4>{equipo.nombre_equipo}</h4>
                    <p className="consecutivo">#{equipo.consecutivo}</p>
                  </div>
                  <div className="equipo-details">
                    <p>
                      <strong>Cliente:</strong>{" "}
                      {equipo.cliente_nombre || "No especificado"}
                    </p>
                  </div>
                  <div className="equipo-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        cambiarEstado(equipo.id, equipo.estado - 1);
                      }}
                      disabled={equipo.estado === 1}
                    >
                      ◄ Anterior
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        cambiarEstado(equipo.id, equipo.estado + 1);
                      }}
                      disabled={equipo.estado === estados.length}
                    >
                      Siguiente ►
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquiposProceso;
