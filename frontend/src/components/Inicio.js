import { Link } from "react-router-dom";

export default function Inicio() {
  const containerStyle = {
    position: "relative",
    minHeight: "80vh",
    background: "url('/images/municipalidad.png') no-repeat center center/cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.55)",
    zIndex: 1,
  };

  const contentStyle = {
    position: "relative",
    zIndex: 2,
    maxWidth: "900px",
  };

  // Tarjeta semitransparente
  const cardStyle = {
    borderRadius: "1rem",
    background: "rgba(255, 255, 255, 0.60)",
    backdropFilter: "blur(1px)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  const hoverStyle = {
    transform: "translateY(-6px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
  };

  const iconCircleStyle = (color, bg) => ({
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bg,
    color: color,
    marginBottom: "1rem",
  });

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      <div style={contentStyle} className="container">
        {/* Mensaje de bienvenida */}
        <div className="mb-5">
          <h2 className="fw-bold mb-3 display-6">Bienvenido al Portal del Ciudadano</h2>
          <p className="fs-5 text-light">
            Acceda fácilmente a los servicios digitales de la Municipalidad.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="row g-4 justify-content-center">
          {/* --- TARJETA 1 --- */}
          <div className="col-md-5">
            <div
              className="card text-center h-100 border-0 shadow-lg"
              style={cardStyle}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, hoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, cardStyle)
              }
            >
              <div className="card-body d-flex flex-column align-items-center">
                <div
                  style={iconCircleStyle("rgb(13,110,253)", "rgba(13,110,253,0.1)")}
                >
                  <i className="bi bi-upload fs-2"></i>
                </div>
                <h5 className="fw-bold text-primary">Presentar un Trámite</h5>
                <p className="text-muted mt-2">
                  Envíe su solicitud digitalmente. Puede escribirla o adjuntar documentos.
                </p>
                <Link
                  to="/tramite"
                  className="btn btn-primary mt-auto px-4 rounded-pill"
                >
                  Iniciar Trámite
                </Link>
              </div>
            </div>
          </div>

          {/* --- TARJETA 2 --- */}
          <div className="col-md-5">
            <div
              className="card text-center h-100 border-0 shadow-lg"
              style={cardStyle}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, hoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, cardStyle)
              }
            >
              <div className="card-body d-flex flex-column align-items-center">
                <div
                  style={iconCircleStyle("rgb(25,135,84)", "rgba(25,135,84,0.1)")}
                >
                  <i className="bi bi-search fs-2"></i>
                </div>
                <h5 className="fw-bold text-success">Consultar Trámite</h5>
                <p className="text-muted mt-2">
                  Ingrese su DNI para conocer el estado actual de sus trámites.
                </p>
                <Link
                  to="/seguimiento"
                  className="btn btn-success mt-auto px-4 rounded-pill"
                >
                  Consultar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
