// src/components/SistemaAdministrativo/LayoutAdmin.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function LayoutAdmin() {
  return (
    <div className="d-flex">
      {/* Sidebar moderno y fijo */}
      <div
        className="position-fixed top-0 start-0 h-100 text-white shadow-lg"
        style={{
          width: '260px',
          background: 'linear-gradient(180deg, #003366 0%, #004C99 100%)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        <div className="p-4 border-bottom border-light">
          <h5 className="mb-0 fw-bold text-light">🏛️ Sistema Municipal</h5>
        </div>

        <Nav className="flex-column p-3" defaultActiveKey="/admin/tramites">
          <Nav.Link href="/admin/dashboard" className="d-flex align-items-center py-2">
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>

          <Nav.Link
            href="/admin/tramites"
            className="d-flex align-items-center py-2 text-white"
            style={{ transition: '0.3s' }}
          >
            <FaClipboardList className="me-2" /> Trámites
          </Nav.Link>

          <Nav.Link href="/admin/reportes" className="d-flex align-items-center py-2">
            <FaChartBar className="me-2" /> Reportes
          </Nav.Link>

          <Nav.Link
            href="/admin/perfil"
            className="d-flex align-items-center py-2 text-white-50"
            disabled
          >
            <FaUser className="me-2" /> Mi Perfil
          </Nav.Link>
        </Nav>

        <div className="p-3 border-top border-light mt-auto">
          <Nav.Link
            href="/"
            className="d-flex align-items-center py-2 text-danger fw-bold"
            style={{ transition: '0.3s' }}
          >
            <FaSignOutAlt className="me-2" /> Salir
          </Nav.Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: '260px',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Navbar superior moderna */}
        <Navbar
          bg="white"
          variant="light"
          className="shadow-sm position-fixed top-0 w-100"
          style={{
            zIndex: 999,
            left: '260px',
            width: 'calc(100% - 260px)',
            borderBottom: '1px solid #eee',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Container fluid className="d-flex justify-content-between align-items-center">
            <Navbar.Brand href="/admin" className="fw-bold text-primary">
              Municipalidad de Yau
            </Navbar.Brand>
            <Navbar.Text className="text-muted">
              Bienvenido, <strong>Funcionario</strong>
            </Navbar.Text>
          </Container>
        </Navbar>

        {/* Contenido desplazable */}
        <Container
          fluid
          className="py-4"
          style={{
            marginTop: '80px',
            animation: 'fadeIn 0.5s ease',
          }}
        >
          <Outlet />
        </Container>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        /* Efectos hover */
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transform: translateX(5px);
        }

        /* Animación de entrada suave */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
