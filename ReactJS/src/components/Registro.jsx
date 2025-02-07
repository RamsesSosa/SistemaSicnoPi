import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de registro
    console.log(
      "Nombre completo:",
      fullName,
      "Usuario:",
      username,
      "Contraseña:",
      password,
      "Admin:",
      isAdmin
    );
    navigate("/"); // Redirige al usuario a la página de inicio de sesión después del registro
  };

  return (
    <div className="registro-container">
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nombre del usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Administrador
          </label>
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
