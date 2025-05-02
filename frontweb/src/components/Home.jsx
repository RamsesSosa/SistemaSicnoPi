import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const [accesosRapidosAbierto, setAccesosRapidosAbierto] = useState(false);
  const [equiposAbierto, setEquiposAbierto] = useState(false);
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equiposCalibrando, setEquiposCalibrando] = useState(0);
  const [equiposPendientes, setEquiposPendientes] = useState(0);

  // Cargar últimos registros y conteos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener últimos registros
        const registrosResponse = await fetch(
          "http://127.0.0.1:8000/api/equipos/"
        );
        if (!registrosResponse.ok)
          throw new Error("Error al obtener registros");
        const registrosData = await registrosResponse.json();

        // Obtener conteos de equipos
        const conteosResponse = await fetch(
          "http://127.0.0.1:8000/api/equipos-count/"
        );
        const conteosData = conteosResponse.ok
          ? await conteosResponse.json()
          : {};

        // Procesar datos
        setUltimosRegistros(
          registrosData
            .sort(
              (a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada)
            )
            .slice(0, 5)
        );

        setEquiposCalibrando(conteosData.calibrando || 0);
        setEquiposPendientes(conteosData.listo_para_entrega || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAccesosRapidos = () => {
    setAccesosRapidosAbierto(!accesosRapidosAbierto);
  };

  const toggleEquipos = () => {
    setEquiposAbierto(!equiposAbierto);
  };

  return (
    <div className="home-container">
      {/* Sidebar mejorado */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            <i className="fas fa-chart-line"></i> Panel LabCal
          </h2>
        </div>

        <ul>
          {/* Accesos Rápidos */}
          <li className={accesosRapidosAbierto ? "active" : ""}>
            <a href="#" onClick={toggleAccesosRapidos}>
              <i className="fas fa-bolt"></i> Accesos Rápidos
              <i
                className={`fas fa-angle-right menu-arrow ${
                  accesosRapidosAbierto ? "active" : ""
                }`}
              ></i>
            </a>
            {accesosRapidosAbierto && (
              <ul>
                <li>
                  <Link
                    to="/consultar-clientes"
                    className={
                      location.pathname === "/consultar-clientes"
                        ? "active"
                        : ""
                    }
                  >
                    <i className="fas fa-users"></i> Consultar clientes
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Equipos */}
          <li className={equiposAbierto ? "active" : ""}>
            <a href="#" onClick={toggleEquipos}>
              <i className="fas fa-tools"></i> Equipos
              <i
                className={`fas fa-angle-right menu-arrow ${
                  equiposAbierto ? "active" : ""
                }`}
              ></i>
            </a>
            {equiposAbierto && (
              <ul>
                <li>
                  <Link
                    to="/equipos-proceso"
                    className={
                      location.pathname === "/equipos-proceso" ? "active" : ""
                    }
                  >
                    <i className="fas fa-wrench"></i> Equipos en proceso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resumen-mensual"
                    className={
                      location.pathname === "/resumen-mensual" ? "active" : ""
                    }
                  >
                    <i className="fas fa-chart-bar"></i> Resumen mensual
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <div className="sidebar-divider"></div>

          {/* Últimos Registros */}

          {/* Impresiones */}
          <li>
            <Link
              to="/impresiones"
              className={location.pathname === "/impresiones" ? "active" : ""}
            >
              <i className="fas fa-print"></i> Imprimir QR
            </Link>
          </li>

          <div className="sidebar-divider"></div>

          {/* Historial de Calibraciones */}
          <li>
            <Link
              to="/historial-calibraciones"
              className={
                location.pathname === "/historial-calibraciones" ? "active" : ""
              }
            >
              <i className="fas fa-history"></i> Historial
            </Link>
          </li>

          {/* Estadísticas */}
          <li>
            <Link
              to="/estadisticas"
              className={location.pathname === "/estadisticas" ? "active" : ""}
            >
              <i className="fas fa-chart-pie"></i> Estadísticas
            </Link>
          </li>
        </ul>
      </aside>

      {/* Contenido Principal */}
      <div className="main-content">
        {/* Encabezado */}
        <div className="header">
          <h1>Panel de Control</h1>
        </div>

        {/* Tarjetas de Acceso Rápido */}
        <div className="quick-access">
          <div className="card card-register">
            <div className="card-content">
              <div className="card-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Registrar Equipo</h3>
              <p>Agregar nuevo equipo al sistema</p>
              <Link to="/registrar-equipo" className="card-footer">
                Acceder <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="card card-register">
            <div className="card-content">
              <div className="card-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Registrar Cliente</h3>
              <p>Agregar nuevo cliente al sistema</p>
              <Link to="/registrar-cliente" className="card-footer">
                Acceder <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Estado de Equipos */}
        <div className="equipment-status">
          <div className="status-card">
            <h4>Equipos en Calibración</h4>
            <p>
              <Link to="/equipos-proceso" className="status-link">
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  equiposCalibrando
                )}
              </Link>
            </p>
          </div>
          <div className="status-card">
            <h4>Pendientes de Entrega</h4>
            <p>
              <Link to="/equipos-proceso" className="status-link">
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  equiposPendientes
                )}
              </Link>
            </p>
          </div>
        </div>

        {/* Tabla de Últimos Registros */}
        <div className="latest-records">
          <div className="section-header">
            <h2>Últimos Equipos Registrados</h2>
            <Link to="/ultimos-registros" className="view-all">
              Ver todos <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="loading-table">
              <i className="fas fa-spinner fa-spin"></i> Cargando registros...
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          ) : (
            <div className="table-responsive">
              <table>
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
                            ? new Date(
                                registro.fecha_entrada
                              ).toLocaleDateString("es-MX", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "No disponible"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-results">
                        No hay registros disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
