import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación con Yup
const schema = yup.object().shape({
  fullName: yup.string().required('El nombre completo es requerido'),
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña es requerido'),
});

const Register = () => {
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
    // Guardar los datos de registro en localStorage
    const userData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Registro de Usuario</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre completo"
              {...register('fullName')}
            />
            <span className="icon">👤</span>
          </div>
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}

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

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              {...register('confirmPassword')}
            />
            <span className="icon">🔒</span>
          </div>
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}

          

          <button type="submit">Registrar</button>
        </form>
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;