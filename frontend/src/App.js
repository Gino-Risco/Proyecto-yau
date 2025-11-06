// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import DetalleTramite from './components/SistemaAdministrativo/DetalleTramite'; // ✅ Importa el nuevo componente


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
          <Route index element={<ListaTramites />} />
          <Route path="tramites" element={<ListaTramites />} />
          <Route path="tramites/:id" element={<DetalleTramite />} /> {/* ✅ Nueva ruta para detalle de trámite */}
          <Route path="/admin/tramites/:id" element={<DetalleTramite />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Layout público (Portal del Ciudadano)
function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-primary text-white text-center py-4">
        <h1 className="display-5 fw-bold">Municipalidad Provincial de Yau</h1>
        <p className="lead">Sistema Automatizado de Gestión de Trámites</p>
      </header>

      <main className="flex-grow-1">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;