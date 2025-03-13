import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarCliente = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear el objeto del cliente
    const cliente = {
      nombres
     
    };

    // Obtener clientes existentes de localStorage
    const clientesRegistrados = JSON.parse(localStorage.getItem('clientes')) || [];

    // Agregar el nuevo cliente
    clientesRegistrados.push(cliente);

    // Guardar en localStorage
    localStorage.setItem('clientes', JSON.stringify(clientesRegistrados));

    // Redirigir a la página de inicio
    navigate('/home');
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
          <h2>Información Personal</h2>
          <div className="form-group">
            <label htmlFor="nombres">Nombres</label>
            <input
              type="text"
              id="nombres"
              placeholder="Ingrese los nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>
          
        </div>

        {/* Sección de Contacto */}
       
          
            
            
         
            
       

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