import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importar SweetAlert2

const RegistrarCliente = () => {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cliente = { nombre_cliente: nombres };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/clientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) throw new Error("Error al guardar el cliente");

      // Guardar en localStorage
      const clientesRegistrados =
        JSON.parse(localStorage.getItem("clientes")) || [];
      clientesRegistrados.push(cliente);
      localStorage.setItem("clientes", JSON.stringify(clientesRegistrados));

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        title: "¡Éxito!",
        text: "Se ha guardado el cliente exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "sweet-alert-popup", // Clase personalizada para el diseño
        },
      });

      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al guardar el cliente",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleCancelar = () => {
    const confirmarSalida = window.confirm(
      "¿Estás seguro de que deseas salir? Los cambios no guardados se perderán."
    );
    if (confirmarSalida) {
      navigate("/home");
    }
  };

  return (
    <div className="registrar-cliente-container">
      <h1>Registro de Cliente</h1>
      <form className="registrar-cliente-form" onSubmit={handleSubmit}>
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
        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            Guardar
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={handleCancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarCliente;