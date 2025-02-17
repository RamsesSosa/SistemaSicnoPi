import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Router>
      <div className="wrapper">
        {/* Navbar */}
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar */}
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <a href="#" className="brand-link">
            <span className="brand-text font-weight-light">AdminLTE Panel</span>
          </a>
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="nav-icon fas fa-home"></i>
                    <p>Inicio</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/equipos" className="nav-link">
                    <i className="nav-icon fas fa-tools"></i>
                    <p>Equipos</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/clientes" className="nav-link">
                    <i className="nav-icon fas fa-user"></i>
                    <p>Clientes</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/historial" className="nav-link">
                    <i className="nav-icon fas fa-history"></i>
                    <p>Historial de Calibraciones</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/estadisticas" className="nav-link">
                    <i className="nav-icon fas fa-chart-bar"></i>
                    <p>Estadísticas</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="content-wrapper" style={{ minHeight: '130vh', marginLeft: '250px' }}>
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="m-0">Panel de Control</h1>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                {/* Botón Nuevo */}
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>+ Nuevo</h3>
                      <p>Registrar Equipo</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-tools"></i>
                    </div>
                    <Link to="/registrar-equipo" className="small-box-footer">
                      Más info <i className="fas fa-arrow-circle-right"></i>
                    </Link>
                  </div>
                </div>

                {/* Botón Cliente */}
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>+ Cliente</h3>
                      <p>Registrar Cliente</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <Link to="/registrar-cliente" className="small-box-footer">
                      Más info <i className="fas fa-arrow-circle-right"></i>
                    </Link>
                  </div>
                </div>

                {/* Tarjeta Equipos en Calibración */}
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>15</h3>
                      <p>Equipos en Calibración</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-wrench"></i>
                    </div>
                  </div>
                </div>

                {/* Tarjeta Pendientes de Entrega */}
                <div className="col-lg-3 col-md-6 col-sm-12">
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>5</h3>
                      <p>Pendientes de Entrega</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla responsiva */}
              <div className="row">
                <div className="col-lg-12 col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Últimos Equipos Registrados</h3>
                    </div>
                    <div className="card-body table-responsive">
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
                              <span className="badge bg-warning">En calibración</span>
                            </td>
                            <td>Empresa X</td>
                            <td>2025-02-15</td>
                            <td>
                              <button className="btn btn-primary btn-sm mr-1">
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
    </Router>
  );
};

export default App;
