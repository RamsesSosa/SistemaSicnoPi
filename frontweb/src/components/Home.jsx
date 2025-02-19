// inicio principal
import { Link } from "react-router-dom";
import "admin-lte/dist/css/adminlte.min.css";
import "font-awesome/css/font-awesome.min.css";

const Home = () => {
  return (
    <div className="wrapper" style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/home">
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/home" className="brand-link">
          <span className="brand-text font-weight-light">AdminLTE Panel</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <i className="nav-icon fas fa-home"></i> <p>Inicio</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/equipos" className="nav-link">
                  <i className="nav-icon fas fa-tools"></i> <p>Equipos</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/clientes" className="nav-link">
                  <i className="nav-icon fas fa-user"></i> <p>Clientes</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/calibraciones" className="nav-link">
                  <i className="nav-icon fas fa-history"></i>{" "}
                  <p>Historial de Calibraciones</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/estadisticas" className="nav-link">
                  <i className="nav-icon fas fa-chart-line"></i>{" "}
                  <p>Estadísticas</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div
        className="content-wrapper"
        style={{ minHeight: "calc(100vh - 57px)" }}
      >
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Panel de Control</h1>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            {/* Accesos rápidos */}
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>+ Nuevo</h3>
                    <p>Registrar Equipo</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-tools"></i>
                  </div>
                  <Link to="/equipos" className="small-box-footer">
                    Más info <i className="fas fa-arrow-circle-right"></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>+ Cliente</h3>
                    <p>Registrar Cliente</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <Link to="/clientes" className="small-box-footer">
                    Más info <i className="fas fa-arrow-circle-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tablero de Estado */}
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                <div className="info-box bg-warning">
                  <span className="info-box-icon">
                    <i className="fas fa-wrench"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Equipos en Calibración
                    </span>
                    <span className="info-box-number">15</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                <div className="info-box bg-danger">
                  <span className="info-box-icon">
                    <i className="fas fa-clock"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">Pendientes de Entrega</span>
                    <span className="info-box-number">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de Últimos Registros */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Últimos Equipos Registrados</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered">
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
                            <td>CI-311-24-012</td>
                            <td>
                              <span className="badge bg-warning">
                                En calibración
                              </span>
                            </td>
                            <td>Empresa X</td>
                            <td>2025-02-15</td>
                            <td>
                              <button className="btn btn-primary btn-sm">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-info btn-sm">
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
