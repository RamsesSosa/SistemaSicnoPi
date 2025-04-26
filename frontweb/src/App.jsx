import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import GraficosMetricasClave from "./components/GraficosMetricasClave";
import Notificaciones from "./components/Notificaciones";
import RegistrarEquipo from "./components/RegistrarEquipo";
import RegistrarCliente from "./components/RegistrarCliente";
import ConsultarEquipos from "./components/ConsultarEquipos";
import ConsultarClientes from "./components/ConsultarClientes";
import HistorialCalibraciones from "./components/HistorialCalibraciones";
import EquiposCalibracion from "./components/EquiposCalibracion";
import ResumenMensual from "./components/ResumenMensual";
import BusquedaEquipo from "./components/BusquedaEquipo";
import UltimosRegistros from "./components/UltimosRegistros";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica si hay un token de acceso

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ultimos-registros"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UltimosRegistros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/GraficosMetricasClave"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GraficosMetricasClave />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Notificaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar-equipo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegistrarEquipo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar-cliente"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RegistrarCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-equipos"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ConsultarEquipos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultar-clientes"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ConsultarClientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial-calibraciones"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HistorialCalibraciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equipos-calibracion"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EquiposCalibracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumen-mensual"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ResumenMensual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/busqueda-equipo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BusquedaEquipo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div>Ruta protegida de prueba</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;