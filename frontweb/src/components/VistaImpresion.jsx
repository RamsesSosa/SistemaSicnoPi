import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./VistaImpresion.css";

const VistaImpresion = () => {
  const location = useLocation();
  const equipos = location.state?.equipos || [];

  const baseUrl = window.location.origin;
  const anioActual = new Date().getFullYear();

  const generarCodigo = (id) => {
    const idFormateado = String(id).padStart(3, "0");
    return `CI-${id}-${anioActual}-${idFormateado}`;
  };

  return (
    <div className="pagina-impresion">
      {equipos.map((equipo) => {
        const codigo = generarCodigo(equipo.id);
        return (
          <div key={equipo.id} className="qr-item">
            <QRCodeCanvas 
              value={`${baseUrl}/equipos/${equipo.id}`} 
              size={128} 
            />
            <p className="qr-text">{codigo}</p>
          </div>
        );
      })}
      <div className="print-footer">
        <button onClick={() => window.print()} className="btn-imprimir">
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default VistaImpresion;
