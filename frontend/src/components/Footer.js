// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer
      className="text-center text-light mt-auto"
      style={{
        background: 'linear-gradient(90deg, #002B5B 0%, #004C99 100%)',
        padding: '25px 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="container">
        {/* Línea superior decorativa */}
        <div
          style={{
            width: '60px',
            height: '3px',
            background: '#00C8FF',
            margin: '0 auto 10px auto',
            borderRadius: '2px',
          }}
        ></div>

        {/* Texto institucional */}
        <p className="mb-1 fw-semibold">
          © {new Date().getFullYear()} Municipalidad Provincial de Yau – Junín, Perú
        </p>

        {/* Descripción del sistema */}
        <p className="mb-0 small text-white-50">
          Sistema Automatizado de Gestión de Trámites • Desarrollado con tecnología nacional 🇵🇪
        </p>

        {/* Línea inferior sutil */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            marginTop: '15px',
          }}
        ></div>

        {/* Animación hover sutil */}
        <style>{`
          footer p {
            transition: color 0.3s ease;
          }
          footer p:hover {
            color: #00C8FF;
          }
        `}</style>
      </div>
    </footer>
  );
}
