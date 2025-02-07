import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    console.log('Usuario:', username, 'Contraseña:', password);
    navigate('/dashboard'); // Redirige al usuario después del login
  };

  return (
    <div className="login-container">
      <h1>Bienvenido!!!</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿Olvidaste tu contraseña?</p>
      <p>¿No tienes una cuenta? <button onClick={() => navigate('/registro')}>Regístrate</button></p>
    </div>
  );
};

export default Login;