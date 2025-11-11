// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import { Outlet } from 'react-router-dom';

// Componentes del Portal del Ciudadano
import Inicio from './components/Inicio';
import FormularioTramite from './components/FormularioTramite';
import Seguimiento from './components/Seguimiento';
import Footer from './components/Footer';

// Componentes del Sistema Administrativo
import LayoutAdmin from './components/SistemaAdministrativo/LayoutAdmin';
import ListaTramites from './components/SistemaAdministrativo/ListaTramites';
import Dashboard from './components/SistemaAdministrativo/Dashboard';
import Reportes from './components/SistemaAdministrativo/Reportes';
import GestionUsuarios from './components/SistemaAdministrativo/GestionUsuarios';
import DetalleTramite from './components/SistemaAdministrativo/DetalleTramite';

import Login from './components/Login';
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas - Portal del Ciudadano */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Inicio />} />
          <Route path="tramite" element={<FormularioTramite />} />
          <Route path="seguimiento" element={<Seguimiento />} />
        </Route>

        {/* Sistema Administrativo */}
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tramites" element={<ListaTramites />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="tramites/:id" element={<DetalleTramite />} />
        </Route>
        {/* Ruta de Login */}
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

// Layout público (Portal del Ciudadano)
function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header
        className="bg-primary text-white text-center shadow-sm"
        style={{
          padding: "1.2rem 0", // más delgado
          background: "linear-gradient(135deg, #004a99, #007bff)", // degradado institucional
        }}
      >
        <img
          src="/images/logo12.png"
          alt="Escudo Municipalidad de Yau"
          className="mb-1"
          style={{
            width: "70px",
            height: "auto",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
        <h2 className="fw-bold mb-0 fs-4">
          Municipalidad Provincial de Yau
        </h2>
        <p className="small mb-0 opacity-75 fst-italic">
          “Comprometidos con la atención digital y transparente”
        </p>
      </header>

      <main className="flex-grow-1 bg-light">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;