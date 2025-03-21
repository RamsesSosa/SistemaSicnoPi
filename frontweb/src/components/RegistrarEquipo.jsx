import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const RegistrarEquipo = () => {
  const navigate = useNavigate();
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [consecutivo, setConsecutivo] = useState('');
  const [accesorios, setAccesorios] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');

  // Obtener la lista de clientes desde la API al cargar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/clientes/');
        if (!response.ok) throw new Error('Error al obtener los clientes');
        const data = await response.json();
        setClientesRegistrados(data);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al cargar los clientes",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };

    fetchClientes();
  }, []);

  // Establecer la fecha de entrada al cargar el componente
  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    setFechaEntrada(fechaActual);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const equipo = {
      nombre_equipo: nombreEquipo,
      numero_serie: numeroSerie,
      marca: marca,
      modelo: modelo,
      consecutivo: consecutivo,
      accesorios: accesorios,
      observaciones: observaciones,
      cliente: clienteSeleccionado,
      fecha_entrada: fechaEntrada,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/equipos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error('Error al guardar el equipo');
      }

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        title: "¡Éxito!",
        text: "Se ha guardado exitosamente el equipo",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "sweet-alert-popup", // Clase personalizada para el diseño
        },
      });

      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al guardar el equipo",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleCancelar = () => {
    const confirmarSalida = window.confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.');
    if (confirmarSalida) {
      navigate('/home');
    }
  };

  return (
    <div className="registrar-equipo-container">
      <h1>Registro de Equipo</h1>
      <form className="registrar-equipo-form" onSubmit={handleSubmit}>
        {/* Sección de cliente */}
        <div className="form-section">
          <h2>Cliente</h2>
          <div className="form-group">
            <label htmlFor="cliente">Seleccionar Cliente</label>
            <select
              id="cliente"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientesRegistrados.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sección de información del equipo */}
        <div className="form-section">
          <h2>Información del Equipo</h2>
          <div className="form-group">
            <label htmlFor="nombre-equipo">Nombre de equipo</label>
            <input
              type="text"
              id="nombre-equipo"
              placeholder="Ingrese el nombre del equipo"
              value={nombreEquipo}
              onChange={(e) => setNombreEquipo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              id="marca"
              placeholder="Ingrese la marca del equipo"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              id="modelo"
              placeholder="Ingrese el modelo del equipo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="numero-serie">Número de serie</label>
            <input
              type="text"
              id="numero-serie"
              placeholder="Ingrese el número de serie"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Nueva sección para la fecha de entrada */}
        <div className="form-section">
          <h2>Fecha de Entrada</h2>
          <div className="form-group">
            <label htmlFor="fecha-entrada">Fecha de Entrada</label>
            <input
              type="text"
              id="fecha-entrada"
              value={fechaEntrada}
              readOnly // Campo de solo lectura
            />
          </div>
        </div>

        {/* Sección de fecha de salida */}
        <div className="form-section">
          <h2>Fecha de Salida</h2>
          <div className="form-group">
            <label htmlFor="fecha-salida">Fecha de Salida</label>
            <input
              type="date"
              id="fecha-salida"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
            />
          </div>
        </div>

        {/* Sección de otros datos */}
        <div className="form-section">
          <h2>Otros Datos</h2>
          <div className="form-group">
            <label htmlFor="consecutivo">Consecutivo</label>
            <input
              type="text"
              id="consecutivo"
              placeholder="Ingrese el consecutivo"
              value={consecutivo}
              onChange={(e) => setConsecutivo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accesorios">Accesorios incluidos</label>
            <input
              type="text"
              id="accesorios"
              placeholder="Ingrese los accesorios"
              value={accesorios}
              onChange={(e) => setAccesorios(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              placeholder="Ingrese las observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="btn-guardar">Guardar e imprimir</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarEquipo;