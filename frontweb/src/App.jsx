import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './components/Home'; // Asegúrate de importar el componente Home

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
            <span className="brand-text font-weight-light">Proceso de calibración</span>
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
                    <p>Estadísticaas</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="content-wrapper" style={{ minHeight: '130vh', marginLeft: '250px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Define otras rutas aquí */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;