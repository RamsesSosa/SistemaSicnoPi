import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./VistaImpresion.css";

const VistaImpresion = () => {
  const location = useLocation();
  const equipos = location.state?.equipos || [];

  return (
    <div className="pagina-impresion">
      {equipos.map((equipo) => (
        <div key={equipo.id} className="qr-item">
          <QRCodeCanvas value={equipo.consecutivo} size={128} />
          <p className="qr-text">{equipo.consecutivo}</p>
        </div>
      ))}
      <div className="print-footer">
        <button onClick={() => window.print()} className="btn-imprimir">
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default VistaImpresion;
