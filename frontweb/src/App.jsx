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
import ConsultarClientes from "./components/ConsultarClientes";
import HistorialCalibraciones from "./components/HistorialCalibraciones";
import EquiposProceso from "./components/EquiposProceso";
import ResumenMensual from "./components/ResumenMensual";
import UltimosRegistros from "./components/UltimosRegistros";
import DetalleEquipo from "./components/DetalleEquipo";


const App = () => {
  const isAuthenticated = true; // Cambia esto según tu lógica de autenticación

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/ultimos-registros" element={<UltimosRegistros />} />
        <Route
          path="/GraficosMetricasClave"
          element={<GraficosMetricasClave />}
        />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/registrar-equipo" element={<RegistrarEquipo />} />
        <Route path="/registrar-cliente" element={<RegistrarCliente />} />
        <Route path="/consultar-clientes" element={<ConsultarClientes />} />
        <Route
          path="/historial-calibraciones"
          element={<HistorialCalibraciones />}
        />
        <Route path="/equipos-proceso" element={<EquiposProceso />} />{" "}
        <Route path="/equipos/:id" element={<DetalleEquipo />} />
        {/* Nueva ruta */}
        {/* Nueva ruta */}
        <Route path="/resumen-mensual" element={<ResumenMensual />} />{" "}
        {/* Nueva ruta */}
        {/* Nueva ruta */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
