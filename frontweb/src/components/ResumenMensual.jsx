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

// Configuración de la API - Modifica esto según tus necesidades
const API_BASE_URL = 'http://127.0.0.1:8000';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutos de caché

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

const ORDER_ESTADOS = [
  "Ingreso",
  "En espera",
  "Calibrando",
  "Calibrado",
  "Etiquetado",
  "Certificado emitido",
  "Listo para entrega",
  "Entregado"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384', '#36A2EB', '#FFCE56'];

const ResumenMensual = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    stats: null
  });
  
  const [apiCache, setApiCache] = useState({});

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

  const fetchData = async () => {
    const cacheKey = `${state.selectedMonth}-${state.selectedYear}`;
    
    // Verificar caché primero
    if (apiCache[cacheKey] && (Date.now() - apiCache[cacheKey].timestamp < CACHE_EXPIRY_TIME)) {
      setState(prev => ({ ...prev, stats: apiCache[cacheKey].data, loading: false }));
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(
        `${API_BASE_URL}/api/metricas/volumen/?mes=${state.selectedMonth}&año=${state.selectedYear}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      if (apiData.status !== "success") {
        throw new Error(apiData.message || "La API no devolvió un estado exitoso");
      }
      
      // Transformar los datos de la API al formato que necesita el frontend
      const transformedData = {
        recibidos: apiData.volumen_trabajo.equipos_recibidos || 0,
        calibrados: apiData.volumen_trabajo.equipos_calibrados || 0,
        entregados: apiData.volumen_trabajo.equipos_entregados || 0,
        pendientes: apiData.volumen_trabajo.equipos_pendientes || 0,
        por_estado: ORDER_ESTADOS.reduce((acc, estado) => {
          acc[estado] = apiData.estados[estado] || 0;
          return acc;
        }, {})
      };
      
      // Actualizar caché
      setApiCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: transformedData,
          timestamp: Date.now()
        }
      }));
      
      // Actualizar estado
      setState(prev => ({
        ...prev,
        stats: transformedData,
        loading: false
      }));
    } catch (error) {
      clearTimeout(timeoutId);
      const errorMsg = error.name === 'AbortError' 
        ? 'La solicitud tardó demasiado. Por favor intente nuevamente.'
        : error.message || 'Error desconocido al cargar los datos';
      
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [state.selectedMonth, state.selectedYear]);

  const handleMonthChange = (e) => {
    setState(prev => ({ ...prev, selectedMonth: parseInt(e.target.value) }));
  };

  const handleYearChange = (e) => {
    setState(prev => ({ ...prev, selectedYear: parseInt(e.target.value) }));
  };

  const prepareChartData = () => {
    if (!state.stats) return [];
    
    return [{
      name: 'Resumen',
      Recibidos: state.stats.recibidos,
      Calibrados: state.stats.calibrados,
      Entregados: state.stats.entregados,
      Pendientes: state.stats.pendientes
    }];
  };

  const prepareStatusData = () => {
    if (!state.stats?.por_estado) return [];
    
    return Object.entries(state.stats.por_estado)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  if (state.loading) return <LoadingSpinner />;
  if (state.error) return <ErrorMessage error={state.error} onRetry={fetchData} />;

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
                <h2>Distribución por Estado Actual</h2>
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
                    <Tooltip formatter={(value) => [`${value} equipos`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumenMensual;