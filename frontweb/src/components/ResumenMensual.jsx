import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './ResumenMensual.css';

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner"></div>
    <p>Cargando datos...</p>
  </div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-message">
    <p>Error: {error}</p>
    <button onClick={onRetry}>Reintentar</button>
  </div>
);

const mockData = {
  resumen: {
    recibidos: 45,
    calibrados: 32,
    entregados: 28,
    pendientes: 17,
    por_estado: {
      "En revisión": 8,
      "En calibración": 12,
      "Calibrado": 15,
      "Entregado": 28,
      "Rechazado": 2
    }
  },
  detalle: [
    {
      id: 1,
      nombre_equipo: "Multímetro Digital",
      cliente_nombre: "Laboratorio Central",
      estado_actual: "Entregado",
      fecha_entrada: "2023-05-01"
    },
    {
      id: 2,
      nombre_equipo: "Fuente de Poder",
      cliente_nombre: "Taller Electrónico",
      estado_actual: "En calibración",
      fecha_entrada: "2023-05-03"
    },
    {
      id: 3,
      nombre_equipo: "Osciloscopio",
      cliente_nombre: "Universidad Técnica",
      estado_actual: "Calibrado",
      fecha_entrada: "2023-05-05"
    },
    {
      id: 4,
      nombre_equipo: "Generador de Señales",
      cliente_nombre: "Instituto de Investigación",
      estado_actual: "En revisión",
      fecha_entrada: "2023-05-07"
    },
    {
      id: 5,
      nombre_equipo: "Analizador de Espectro",
      cliente_nombre: "Empresa Telecom",
      estado_actual: "Rechazado",
      fecha_entrada: "2023-05-10"
    },
    {
      id: 6,
      nombre_equipo: "Termómetro Digital",
      cliente_nombre: "Hospital General",
      estado_actual: "Entregado",
      fecha_entrada: "2023-05-12"
    },
    {
      id: 7,
      nombre_equipo: "Medidor de pH",
      cliente_nombre: "Laboratorio Químico",
      estado_actual: "Calibrado",
      fecha_entrada: "2023-05-15"
    },
    {
      id: 8,
      nombre_equipo: "Báscula Industrial",
      cliente_nombre: "Fábrica de Alimentos",
      estado_actual: "En calibración",
      fecha_entrada: "2023-05-18"
    },
    {
      id: 9,
      nombre_equipo: "Cámara Termográfica",
      cliente_nombre: "Empresa Energética",
      estado_actual: "En revisión",
      fecha_entrada: "2023-05-20"
    },
    {
      id: 10,
      nombre_equipo: "Analizador de Redes",
      cliente_nombre: "Compañía Telecom",
      estado_actual: "Entregado",
      fecha_entrada: "2023-05-22"
    }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ResumenMensual = () => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    stats: null
  });

  const MONTHS = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const fetchData = async () => {
    try {
      updateState({ loading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      updateState({
        data: mockData.detalle,
        stats: mockData.resumen,
        loading: false
      });
    } catch (error) {
      console.error('Error al obtener datos:', error);
      updateState({ 
        error: error.message || 'Error desconocido al cargar los datos',
        loading: false 
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [state.selectedMonth, state.selectedYear]);

  const handleMonthChange = (e) => {
    updateState({ selectedMonth: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    updateState({ selectedYear: parseInt(e.target.value) });
  };

  const prepareChartData = () => {
    if (!state.stats) return [];
    
    return [
      {
        name: 'Resumen',
        Recibidos: state.stats.recibidos || 0,
        Calibrados: state.stats.calibrados || 0,
        Entregados: state.stats.entregados || 0,
        Pendientes: state.stats.pendientes || 0
      }
    ];
  };

  const prepareStatusData = () => {
    if (!state.stats || !state.stats.por_estado) return [];
    
    return Object.entries(state.stats.por_estado).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <div className="resumen-mensual-container">
      <div className="resumen-content">
        <h1>Resumen Mensual de Equipos</h1>
        
        <div className="filters">
          <div className="filter-group">
            <label>Mes:</label>
            <select 
              value={state.selectedMonth} 
              onChange={handleMonthChange}
            >
              {MONTHS.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Año:</label>
            <select 
              value={state.selectedYear} 
              onChange={handleYearChange}
            >
              {YEARS.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.stats && (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Equipos Recibidos</h3>
                <div className="stat">{state.stats.recibidos}</div>
                <p className="subtext">Total recibidos este mes</p>
              </div>
              <div className="summary-card">
                <h3>Equipos Calibrados</h3>
                <div className="stat">{state.stats.calibrados}</div>
                <p className="subtext">Procesados correctamente</p>
              </div>
              <div className="summary-card">
                <h3>Equipos Entregados</h3>
                <div className="stat">{state.stats.entregados}</div>
                <p className="subtext">Devueltos a clientes</p>
              </div>
              <div className="summary-card">
                <h3>Equipos Pendientes</h3>
                <div className="stat">{state.stats.pendientes}</div>
                <p className="subtext">En proceso</p>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart">
                <h2>Resumen General</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Recibidos" fill="#4a6fa5" />
                    <Bar dataKey="Calibrados" fill="#16a085" />
                    <Bar dataKey="Entregados" fill="#27ae60" />
                    <Bar dataKey="Pendientes" fill="#e74c3c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart">
                <h2>Distribución por Estado</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        <div className="detailed-list">
          <h2>Detalle de Equipos</h2>
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha de Entrada</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map(equipo => (
                <tr key={equipo.id}>
                  <td>{equipo.nombre_equipo}</td>
                  <td>{equipo.cliente_nombre}</td>
                  <td>
                    <span className={`status-badge status-${equipo.estado_actual.toLowerCase().replace(/\s+/g, '-')}`}>
                      {equipo.estado_actual}
                    </span>
                  </td>
                  <td>{new Date(equipo.fecha_entrada).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResumenMensual;