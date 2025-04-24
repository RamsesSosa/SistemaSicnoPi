import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./VistaImpresion.css";

const VistaImpresion = () => {
  const location = useLocation();
  const equipos = location.state?.equipos || [];
  const baseUrl = window.location.origin;
  const ITEMS_POR_PAGINA = 12; // 12 códigos por página

  // Calcular número de páginas necesarias
  const totalPaginas = Math.ceil(equipos.length / ITEMS_POR_PAGINA);

  // Dividir los equipos en páginas
  const paginas = Array.from({ length: totalPaginas }, (_, i) =>
    equipos.slice(i * ITEMS_POR_PAGINA, (i + 1) * ITEMS_POR_PAGINA)
  );

  return (
    <div className="vista-impresion">
      <div className="contenedor-paginas">
        {paginas.map((pagina, indexPagina) => (
          <div key={`pagina-${indexPagina}`} className="pagina-qr">
            <div className="encabezado">
              <h2>Control de Equipos</h2>
              <p>Página {indexPagina + 1} de {totalPaginas}</p>
            </div>

            <div className="grid-qrs">
              {pagina.map((equipo) => (
                <div key={`qr-${equipo.id}`} className="item-qr">
                  <QRCodeCanvas
                    value={`${baseUrl}/equipos/${equipo.id}`}
                    size={140}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="consecutivo">{equipo.consecutivo}</p>
                </div>
              ))}
              
              {/* Rellenar con espacios vacíos si la página no está completa */}
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

      <div className="boton-impresion">
        <button onClick={() => window.print()} className="btn-imprimir">
          <i className="fas fa-print"></i> Imprimir {totalPaginas} página{totalPaginas !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default VistaImpresion;