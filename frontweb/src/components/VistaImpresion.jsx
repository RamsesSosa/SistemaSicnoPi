import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./VistaImpresion.css";

const VistaImpresion = () => {
  const location = useLocation();
  const equipos = location.state?.equipos || [];
  const baseUrl = window.location.origin;
  const ITEMS_POR_PAGINA = 16; // 4x4 grid

  const totalPaginas = Math.ceil(equipos.length / ITEMS_POR_PAGINA);

  const paginas = Array.from({ length: totalPaginas }, (_, i) =>
    equipos.slice(i * ITEMS_POR_PAGINA, (i + 1) * ITEMS_POR_PAGINA)
  );

  return (
    <div className="vista-impresion">
      <div className="scroll-container">
        <div className="contenedor-paginas">
          {paginas.map((pagina, indexPagina) => (
            <div key={`pagina-${indexPagina}`} className="pagina-qr">
              <div className="grid-qrs">
                {pagina.map((equipo) => (
                  <div key={`qr-${equipo.id}`} className="item-qr">
                    <QRCodeCanvas
                      value={`${baseUrl}/equipos/${equipo.id}`}
                      size={100}
                      level="H"
                      includeMargin={false}
                    />
                    <p className="consecutivo">{equipo.consecutivo}</p>
                  </div>
                ))}

                {pagina.length < ITEMS_POR_PAGINA &&
                  Array.from({ length: ITEMS_POR_PAGINA - pagina.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="item-qr empty"></div>
                  ))}
              </div>

              <div className="pie-pagina">
                <p>Impreso el {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="boton-impresion">
        <div className="contenedor-boton">
          <button onClick={() => window.print()} className="btn-imprimir">
            <i className="fas fa-print"></i> Imprimir página{totalPaginas !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VistaImpresion;
