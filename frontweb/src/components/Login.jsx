import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
<<<<<<< HEAD
import axios from 'axios';

// Esquema de validación con Yup
const schema = yup.object().shape({
=======

// Esquema de validación con Yup
const loginSchema = yup.object().shape({
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const navigate = useNavigate();

  // Configurar React Hook Form
=======
  const [loginError, setLoginError] = useState(''); // Estado para manejar errores de inicio de sesión
  const navigate = useNavigate();

>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
<<<<<<< HEAD
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        correo: data.email,
        password: data.password,
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/home');  // Redirect to Home page after successful login
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
=======
    resolver: yupResolver(loginSchema),
  });


  const onSubmit = (data) => {
    // Obtener los datos de registro almacenados en localStorage
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));


    if (
      registeredUser &&
      registeredUser.email === data.email &&
      registeredUser.password === data.password
    ) {
      // Inicio de sesión exitoso
      console.log('Inicio de sesión exitoso');
      setLoginError('');
      navigate('/home'); // Redirigir a la página de inicio
    } else {
      // Credenciales incorrectas
      setLoginError('Correo electrónico o contraseña incorrectos');
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
    }
  };

  return (
<<<<<<< HEAD
    <div className="login-page">
      <div className="login-container">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register('email')}
            />
            <span className="icon">✉️</span>
          </div>
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              {...register('password')}
            />
            <span className="icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '👁️' : '🔒'}
            </span>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        <p>
          ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  );
};

=======
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            {...register('email')}
          />
          <span className="icon">✉️</span>
        </div>
        {errors.email && <p className="error">{errors.email.message}</p>}

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            {...register('password')}
          />
          <span className="icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁️" : "🔒"}
          </span>
        </div>
        {errors.password && <p className="error">{errors.password.message}</p>}

        {loginError && <p className="error">{loginError}</p>}

        <button type="submit">Iniciar Sesión</button>
      </form>
      <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      <p>
        ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
      </p>
    </div>
  );
};
  
>>>>>>> 3dd0c1235b06a864ae24886e66ecb7007e197783
export default Login;