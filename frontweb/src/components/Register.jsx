import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Esquema de validación con Yup
const registerSchema = yup.object().shape({
  fullName: yup.string().required('El nombre completo es requerido'),
  email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('La confirmación de contraseña es requerida'),
  role: yup.string().required('El rol es requerido'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    // Guardar los datos de registro en localStorage
    const userData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    };
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    console.log('Usuario registrado:', userData);
    navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
  };

  return (
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
        {errors.fullName && <p className="error">{errors.fullName.message}</p>}

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

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            {...register('confirmPassword')}
          />
          <span className="icon">🔒</span>
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

       
        {errors.role && <p className="error">{errors.role.message}</p>}

        <button type="submit">Registrar</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
      </p>
    </div>
  );
};

export default Register;