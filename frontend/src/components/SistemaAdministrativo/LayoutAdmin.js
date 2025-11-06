// src/components/SistemaAdministrativo/LayoutAdmin.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Card } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function LayoutAdmin() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-white shadow-sm" style={{ width: '260px' }}>
        <div className="p-4 border-bottom">
          <h5 className="mb-0 text-primary">Sistema Municipal</h5>
        </div>
        <Nav className="flex-column p-3" defaultActiveKey="/admin/tramites">
          <Nav.Link href="/admin" className="d-flex align-items-center py-2">
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>
          <Nav.Link href="/admin/tramites" className="d-flex align-items-center py-3">
            <FaClipboardList className="me-2" /> Trámites
          </Nav.Link>
          <Nav.Link href="/admin/reportes" className="d-flex align-items-center py-2" disabled>
            <FaChartBar className="me-2" /> Reportes
          </Nav.Link>
          <Nav.Link href="/admin/perfil" className="d-flex align-items-center py-3" disabled>
            <FaUser className="me-2" /> Mi Perfil
          </Nav.Link>
        </Nav>
        <div className="p-3 mt-auto border-top">
          <Nav.Link href="/" className="d-flex align-items-center py-2 text-danger">
            <FaSignOutAlt className="me-2" /> Salir
          </Nav.Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1">
        {/* Navbar interna (solo para admin) */}
        <Navbar bg="white" variant="light" className="shadow-sm">
          <Container>
            <Navbar.Brand href="/admin">
              <span className="text-primary fw-bold">Municipalidad de Yau</span>
            </Navbar.Brand>
            <Navbar.Text>
              Bienvenido, <strong>Funcionario</strong>
            </Navbar.Text>
          </Container>
        </Navbar>

        <Container fluid className="py-4">
          <Outlet /> {/* Aquí se renderizan Dashboard, ListaTramites, etc. */}
        </Container>
      </div>
    </div>
  );
}