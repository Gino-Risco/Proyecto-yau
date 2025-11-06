import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css'; // ✅ Importa los estilos

export default function Inicio() {
  return (
    <div className="inicio-container">
      {/* Sección principal con fondo */}
      <section className="hero-section text-center text-white py-5">
        <div className="overlay">
          <div className="container">
            <h1 className="fw-bold display-5 mb-3 animate__animated animate__fadeInDown">
              Municipalidad Provincial de Yau
            </h1>
            <p className="lead fst-italic mb-4 animate__animated animate__fadeInUp">
              “Comprometidos con la atención digital y transparente para todos los ciudadanos.”
            </p>
          </div>
        </div>
      </section>

      {/* Opciones de usuario */}
      <section className="tramites-section container py-5">
        <div className="row g-4 justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-sm text-center h-100 card-hover">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="icon-circle bg-primary bg-opacity-10 text-primary mb-3">
                  <i className="bi bi-upload fs-2"></i>
                </div>
                <h5 className="fw-bold text-primary">Presentar un Trámite</h5>
                <p className="text-muted mt-2">
                  Envíe su solicitud digitalmente. Puede escribirla o adjuntar un documento (PDF, JPG, PNG).
                </p>
                <Link to="/tramite" className="btn btn-primary mt-auto px-4 rounded-pill">
                  Iniciar Trámite
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm text-center h-100 card-hover">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="icon-circle bg-success bg-opacity-10 text-success mb-3">
                  <i className="bi bi-search fs-2"></i>
                </div>
                <h5 className="fw-bold text-success">Consultar Trámite</h5>
                <p className="text-muted mt-2">
                  Ingrese su DNI para conocer el estado actual de sus trámites en curso o resueltos.
                </p>
                <Link to="/seguimiento" className="btn btn-success mt-auto px-4 rounded-pill">
                  Consultar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
