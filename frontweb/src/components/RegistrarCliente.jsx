import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarCliente = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');

  // Marca la función handleSubmit como async
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto del cliente
    const cliente = {
      nombre_cliente: nombres, // 'nombres' es el valor que el usuario introduce
    };

    
    try {
      // Enviar los datos a la API de Django
      const response = await fetch('http://127.0.0.1:8000/api/clientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el cliente');
      }

      // Redirigir a la página de inicio
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el cliente');
    }
  };

  const handleCancelar = () => {
    const confirmarSalida = window.confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.');
    if (confirmarSalida) {
      navigate('/home');
    }
  };

  return (
    <div className="registrar-cliente-container">
      <h1>Registro de Cliente</h1>
      <form className="registrar-cliente-form" onSubmit={handleSubmit}>
        {/* Sección de Información Personal */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="nombres">Nombre de la empresa</label>
            <input
              type="text"
              id="nombres"
              placeholder="Grupo Bimbo"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            Guardar
          </button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarCliente;