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
                <div className="btn-group d-flex flex-wrap">
                  <Link to="/registrar-equipo" className="btn btn-primary m-1">
                    Registrar nuevo equipo
                  </Link>
                  <Link to="/registrar-cliente" className="btn btn-primary m-1">
                    Registrar nuevo cliente
                  </Link>
                  <Link to="/consultar-equipos" className="btn btn-primary m-1">
                    Consultar equipos registrados
                  </Link>
                  <Link to="/consultar-clientes" className="btn btn-primary m-1">
                    Consultar clientes registrados
                  </Link>
                  <Link to="/historial-calibraciones" className="btn btn-primary m-1">
                    Historial de calibraciones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablero de Estado */}
        <div className="row">
          <div className="col-md-4 mb-3">
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
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📅 Equipos Pendientes de Entrega</h3>
              </div>
              <div className="card-body">
                <p>Total: 10</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
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
          </div>
        </div>

        {/* Tabla de Últimos Registros */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📌 Últimos Equipos Registrados</h3>
              </div>
              <div className="card-body table-responsive">
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
    </div>
  );
};

export default Home;