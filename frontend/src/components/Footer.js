// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p className="mb-1">
          © {new Date().getFullYear()} Municipalidad Provincial de Yau – Junín, Perú
        </p>
        <p className="mb-0 small">
          Sistema Automatizado de Gestión de Trámites • Desarrollado con tecnología nacional
        </p>
      </div>
    </footer>
  );
}