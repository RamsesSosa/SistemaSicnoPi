import { useState, useEffect } from 'react';
import './ConsultarEquipos.css';

const ConsultarEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [busquedaConsecutivo, setBusquedaConsecutivo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/equipos/');
        if (!response.ok) throw new Error('Error al obtener los equipos');
        const data = await response.json();
        setEquipos(data);
        setEquiposFiltrados(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Hubo un error al cargar los equipos');
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  useEffect(() => {
    if (busquedaConsecutivo.trim() === '') {
      setEquiposFiltrados(equipos);
    } else {
      const filtrados = equipos.filter(equipo =>
        equipo.consecutivo.toLowerCase().includes(busquedaConsecutivo.toLowerCase())
      );
      setEquiposFiltrados(filtrados);
    }
  }, [busquedaConsecutivo, equipos]);

  const handleBusquedaChange = (e) => {
    setBusquedaConsecutivo(e.target.value);
  };

  if (loading) {
    return (
      <div className="consultar-equipos-container loading">
        <div className="loading-spinner"></div>
        <p>Cargando equipos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultar-equipos-container error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="consultar-equipos-container">
      <div className="header-section">
        <h1>Consultar Equipos Registrados</h1>
        
        <div className="search-section">
          <div className="search-box">
            <label htmlFor="buscar-consecutivo">Buscar por número consecutivo:</label>
            <input
              type="text"
              id="buscar-consecutivo"
              placeholder="Ingrese el número consecutivo del equipo"
              value={busquedaConsecutivo}
              onChange={handleBusquedaChange}
            />
          </div>
        </div>
      </div>

      <div className="results-container">
        <h2>Resultados de la búsqueda</h2>
        <div className="table-wrapper">
          {equiposFiltrados.length > 0 ? (
            <table className="equipos-table">
              <thead>
                <tr>
                  <th>Nombre de equipo</th>
                  <th>Número de serie</th>
                  <th>Fecha de entrada</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                </tr>
              </thead>
              <tbody>
                {equiposFiltrados.map((equipo) => (
                  <tr key={equipo.id}>
                    <td>{equipo.nombre_equipo}</td>
                    <td>{equipo.numero_serie}</td>
                    <td>{equipo.fecha_entrada || 'No disponible'}</td>
                    <td>{equipo.marca}</td>
                    <td>{equipo.modelo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <p>No se encontraron equipos con ese número consecutivo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultarEquipos;