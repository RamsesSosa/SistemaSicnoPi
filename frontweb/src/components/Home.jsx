import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Importar estilos específicos para Home

const Home = () => {
  const [accesosRapidosAbierto, setAccesosRapidosAbierto] = useState(false);
  const [equiposAbierto, setEquiposAbierto] = useState(false);

  const toggleAccesosRapidos = () => {
    setAccesosRapidosAbierto(!accesosRapidosAbierto);
  };

  const toggleEquipos = () => {
    setEquiposAbierto(!equiposAbierto);
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>AdminLTE Panel</h2>
        <ul>
          {/* Accesos Rápidos */}
          <li>
            <a href="#" onClick={toggleAccesosRapidos}>
              <i className="fas fa-bolt"></i> Accesos Rápidos
              <i
                className={`fas fa-angle-${
                  accesosRapidosAbierto ? "down" : "left"
                }`}
              ></i>
            </a>
            {accesosRapidosAbierto && (
              <ul>
                <li>
                  <Link to="/consultar-equipos">
                    <i className="fas fa-tools"></i> Consultar equipos
                    registrados
                  </Link>
                </li>
                <li>
                  <Link to="/consultar-clientes">
                    <i className="fas fa-users"></i> Consultar clientes
                    registrados
                  </Link>
                </li>
                <li>
                  <Link to="/historial-calibraciones">
                    <i className="fas fa-history"></i> Historial de
                    calibraciones
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Equipos */}
          <li>
            <a href="#" onClick={toggleEquipos}>
              <i className="fas fa-tools"></i> Equipos
              <i
                className={`fas fa-angle-${equiposAbierto ? "down" : "left"}`}
              ></i>
            </a>
            {equiposAbierto && (
              <ul>
                <li>
                  <Link to="/equipos-calibracion">
                    <i className="fas fa-wrench"></i> Equipos en calibración
                  </Link>
                </li>
                <li>
                  <Link to="/equipos-pendientes">
                    <i className="fas fa-clock"></i> Equipos pendientes de
                    entrega
                  </Link>
                </li>
                <li>
                  <Link to="/resumen-mensual">
                    <i className="fas fa-chart-bar"></i> Resumen mensual
                  </Link>
                </li>
                <li>
                  <Link to="/busqueda-equipo">
                    <i className="fas fa-search"></i> Búsqueda de equipo
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Últimos Registros */}
          <li>
            <Link to="/ultimos-registros">
              <i className="fas fa-list"></i> Últimos Registros
            </Link>
          </li>

          {/* Clientes */}
          <li>
            <Link to="/clientes">
              <i className="fas fa-user"></i> Clientes
            </Link>
          </li>

          {/* Historial de Calibraciones */}
          <li>
            <Link to="/calibraciones">
              <i className="fas fa-history"></i> Historial de Calibraciones
            </Link>
          </li>

          {/* Estadísticas */}
          <li>
            <Link to="/estadisticas">
              <i className="fas fa-chart-line"></i> Estadísticas
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
          <div className="card">
            <div className="card-content">
              <h3>+ Nuevo</h3>
              <p>Registrar Equipo</p>
              <Link to="/registrar-equipo" className="card-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <h3>+ Cliente</h3>
              <p>Registrar Cliente</p>
              <Link to="/registrar-cliente" className="card-footer">
                Más info <i className="fas fa-arrow-circle-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Estado de Equipos */}
        <div className="equipment-status">
          <div className="status-card">
            <h4>Equipos en Calibración</h4>
            <p></p>
          </div>
          <div className="status-card">
            <h4>Pendientes de Entrega</h4>
            <p></p>
          </div>
        </div>

        {/* Tabla de Últimos Registros */}
        <div className="latest-records">
          <h2>Últimos Equipos Registrados</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Cliente</th>
                <th>Fecha Entrada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <span className="badge badge-warning"></span>
                </td>
                <td></td>
                <td></td>
                <td>
                  <button className="btn btn-primary">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn btn-info">
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
