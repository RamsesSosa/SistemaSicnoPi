import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación con Yup
const schema = yup.object().shape({
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Datos del formulario:', data);
    // Simulamos un inicio de sesión exitoso
    navigate('/home');
  };

  return (
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

export default Login;