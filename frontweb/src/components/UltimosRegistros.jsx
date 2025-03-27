import { useState, useEffect } from "react";
import "./HistorialCalibraciones.css";

const UltimosRegistros = () => {
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUltimosRegistros = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/equipos/");
        if (!response.ok) throw new Error("Error al obtener los registros");
        const data = await response.json();

        const registrosOrdenados = data
          .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada))
          .slice(0, 10);

        setUltimosRegistros(registrosOrdenados);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Hubo un error al cargar los últimos registros");
        setLoading(false);
      }
    };

    fetchUltimosRegistros();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Cargando últimos registros...</p>
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
    <div className="historial-container">
      <div className="historial-header">
        <h1>Últimos Registros</h1>
      </div>

      <div className="table-container">
        <div className="table-scroll-wrapper">
          <table className="historial-table">
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
                        ? new Date(registro.fecha_entrada).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
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
      </div>
    </div>
  );
};

export default UltimosRegistros;
