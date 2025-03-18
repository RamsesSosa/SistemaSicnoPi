import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrarEquipo = () => {
  const navigate = useNavigate();
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [consecutivo, setConsecutivo] = useState('');
  const [accesorios, setAccesorios] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [clientesRegistrados, setClientesRegistrados] = useState([]);

  useEffect(() => {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    setClientesRegistrados(clientes);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const equipo = {
      cliente: clienteSeleccionado,
      nombreEquipo,
      marca,
      modelo,
      numeroSerie,
      consecutivo,
      accesorios,
      observaciones,
    };

    const equiposRegistrados = JSON.parse(localStorage.getItem('equipos')) || [];
    equiposRegistrados.push(equipo);
    localStorage.setItem('equipos', JSON.stringify(equiposRegistrados));

    navigate('/home');
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
              {clientesRegistrados.map((cliente, index) => (
                <option key={index} value={cliente.nombre_cliente}>
                  {cliente.nombre_cliente}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        <div className="form-section">
          <h2>Fecha de Entrada</h2>
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

        <div className="form-actions">
          <button type="submit" className="btn-guardar">Guardar e imprimir</button>
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarEquipo;
