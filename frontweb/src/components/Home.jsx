<<<<<<< HEAD
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
=======
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  const calibrationData = [
    { month: 'Enero', calibraciones: 120 },
    { month: 'Febrero', calibraciones: 150 },
    { month: 'Marzo', calibraciones: 200 },
  ];

  const recentEquipment = [
    { id: 'CI-311-24-012', status: 'En calibración', client: 'Cliente A', date: '2025-02-16' },
    { id: 'CI-311-24-013', status: 'Pendiente de entrega', client: 'Cliente B', date: '2025-02-15' },
    { id: 'CI-311-24-014', status: 'Entregado', client: 'Cliente C', date: '2025-02-14' },
  ];

  return (
    <div className="content-wrapper">
      {/* Encabezado */}
      <section className="content-header">
        <h1>Bienvenido al Sistema de Calibración</h1>
      </section>

      {/* Contenido Principal */}
      <section className="content">
        {/* Accesos Rápidos */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📌 Accesos Rápidos</h3>
              </div>
              <div className="card-body">

                <div className="btn-group">
                  <Link to="/registrar-equipo" className="btn btn-primary">
                    Registrar nuevo equipo
                  </Link>
                  <Link to="/registrar-cliente" className="btn btn-primary">
                    Registrar nuevo cliente
                  </Link>
                  <Link to="/consultar-equipos" className="btn btn-primary">
                    Consultar equipos registrados
                  </Link>
                  <Link to="/consultar-clientes" className="btn btn-primary">
                    Consultar clientes registrados
                  </Link>
                  <Link to="/historial-calibraciones" className="btn btn-primary">

                    Historial de calibraciones
                  </Link>
                </div>
              </div>
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Estado de Equipos */}
        <div className="equipment-status">
          <div className="status-card">
            <h4>Equipos en Calibración</h4>
            <p></p>
          </div>
          <div className="status-card">
            <h4>Pendientes de Entrega</h4>
            <p></p>
=======
        {/* Tablero de Estado */}
        <div className="row">

          <div className="col-md-4">

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📊 Equipos en Calibración</h3>
              </div>
              <div className="card-body">
                <p>Total: 25</p>
                <p>Últimos: CI-311-24-012, CI-311-24-013</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📅 Equipos Pendientes de Entrega</h3>
              </div>
              <div className="card-body">
                <p>Total: 10</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📈 Resumen Mensual</h3>
              </div>
              <div className="card-body">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: '70%' }}
                    aria-valuenow="70"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    70%
                  </div>
                </div>
                <p>Calibraciones realizadas: 150/200</p>
              </div>
            </div>
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
          </div>
        </div>

        {/* Tabla de Últimos Registros */}
<<<<<<< HEAD
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
=======
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📌 Últimos Equipos Registrados</h3>
              </div>

              <div className="card-body">

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID del Equipo</th>
                      <th>Estado</th>
                      <th>Cliente</th>
                      <th>Fecha de Entrada</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEquipment.map((equipment) => (
                      <tr key={equipment.id}>
                        <td>{equipment.id}</td>
                        <td>{equipment.status}</td>
                        <td>{equipment.client}</td>
                        <td>{equipment.date}</td>
                        <td>
                          <button className="btn btn-sm btn-info">Editar</button>
                          <button className="btn btn-sm btn-warning">Ver detalles</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📈 Métricas Clave</h3>
              </div>
              <div className="card-body">
                <div className="chart">

                  {/* Aquí puedes integrar una librería de gráficos como Chart.js */}

                  <canvas id="calibrationChart" style={{ height: '300px' }}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notificaciones y Alertas */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">⚠️ Alertas Importantes</h3>
              </div>
              <div className="card-body">
                <div className="alert alert-warning" role="alert">
                  Equipos con más de 10 días sin calibración
                </div>
                <div className="alert alert-danger" role="alert">
                  Fallas en la carga de datos
                </div>
                <div className="alert alert-info" role="alert">
                  Clientes con equipos pendientes de recoger
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
