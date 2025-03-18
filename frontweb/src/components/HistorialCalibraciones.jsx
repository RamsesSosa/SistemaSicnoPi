import { useState, useEffect } from "react";

const HistorialCalibraciones = () => {
  const [equiposRegistrados, setEquiposRegistrados] = useState([]);

  useEffect(() => {
    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    setEquiposRegistrados(equipos);
  }, []);

  return (
    <div className="historial-calibraciones-container">
      <h1>Historial de Calibraciones</h1>
      <table className="historial-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Nombre del Equipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Número de Serie</th>
            <th>Consecutivo</th>
            <th>Accesorios</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {equiposRegistrados.length > 0 ? (
            equiposRegistrados.map((equipo, index) => (
              <tr key={index}>
                <td>{equipo.cliente}</td>
                <td>{equipo.nombreEquipo}</td>
                <td>{equipo.marca}</td>
                <td>{equipo.modelo}</td>
                <td>{equipo.numeroSerie}</td>
                <td>{equipo.consecutivo}</td>
                <td>{equipo.accesorios}</td>
                <td>{equipo.observaciones}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No hay registros disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialCalibraciones;
