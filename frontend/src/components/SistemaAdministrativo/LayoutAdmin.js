// src/components/SistemaAdministrativo/LayoutAdmin.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function LayoutAdmin() {
  return (
    <div className="d-flex">
      {/* Sidebar futurista */}
      <div
        className="position-fixed top-0 start-0 h-100 text-white shadow-lg d-flex flex-column"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #001f3f 0%, #003366 100%)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          boxShadow: "0 0 25px rgba(0, 100, 255, 0.4)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Logo y título */}
        <div className="p-4 text-center border-bottom border-light">
          <img
            src="/images/logo12.png" 
            alt="Logo"
            style={{
              width: "100px",
              height: "130px",
              borderRadius: "50%",
              marginBottom: "15px",
              border: "2px solid rgba(255,255,255,0.2)",
              boxShadow: "0 0 10px rgba(0,150,255,0.6)",
            }}
          />
          <h5 className="fw-bold text-light mb-0">Sistema Municipal</h5>
        </div>

        {/* Navegación */}
        <Nav className="flex-column p-3 flex-grow-1 mt-3" defaultActiveKey="/admin/dashboard">
          <CustomNavLink href="/admin/dashboard" icon={<FaHome />} label="Dashboard" />
          <CustomNavLink href="/admin/tramites" icon={<FaClipboardList />} label="Trámites" />
          <CustomNavLink href="/admin/reportes" icon={<FaChartBar />} label="Reportes" />
          <CustomNavLink href="/admin/usuarios" icon={<FaUser />} label="Usuarios" />
          <CustomNavLink href="/admin/perfil" icon={<FaUser />} label="Mi Perfil" disabled />
        </Nav>

        {/* Botón salir */}
        <div className="p-3" style={{ marginBottom: "250px" }}>
          <Button
            variant="outline-danger"
            className="d-flex align-items-center justify-content-center w-100 fw-semibold"
            style={{
              border: "1px solid rgba(255, 0, 0, 0.4)",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              transition: "0.3s ease",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt className="me-2" /> Salir
          </Button>
        </div>
      </div>
      {/* Contenido principal */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Navbar superior */}
        <Navbar
          bg="white"
          variant="light"
          className="shadow-sm position-fixed top-0 w-100"
          style={{
            zIndex: 999,
            left: "260px",
            width: "calc(100% - 260px)",
            borderBottom: "1px solid #eee",
            backdropFilter: "blur(8px)",
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
            marginTop: "80px",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <Outlet />
        </Container>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .nav-link {
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          border-radius: 10px;
          margin: 4px 0;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #00bfff;
          transform: translateX(5px);
          box-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
        }

        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.15);
          color: #00bfff !important;
          box-shadow: inset 0 0 10px rgba(0, 150, 255, 0.5);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* Componente NavLink personalizado */
function CustomNavLink({ href, icon, label, disabled }) {
  return (
    <Nav.Link
      href={href}
      disabled={disabled}
      className={`d-flex align-items-center py-2 ${disabled ? "text-secondary" : ""}`}
    >
      <span className="me-2 fs-5">{icon}</span>
      {label}
    </Nav.Link>
  );
}
