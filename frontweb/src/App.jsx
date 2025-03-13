import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Equipos from "./components/Equipos";
import Clientes from "./components/Clientes";
import Calibraciones from "./components/Calibraciones";
import Estadisticas from "./components/Estadisticas";
import RegistrarEquipo from "./components/RegistrarEquipo";
import RegistrarCliente from "./components/RegistrarCliente";

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
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/registrar-equipo" element={<RegistrarEquipo />} />
        <Route path="/registrar-cliente" element={<RegistrarCliente />} />
        <Route path="/calibraciones" element={<Calibraciones />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
