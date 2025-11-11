// src/components/SistemaAdministrativo/LayoutAdmin.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaHome, FaClipboardList, FaChartBar, FaUser, FaSignOutAlt, FaBell, FaUserCircle } from 'react-icons/fa';

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
        {/* Navbar superior mejorado con notificaciones */}
        <Navbar
          bg="white"
          variant="light"
          expand="lg"
          className="shadow-sm position-fixed top-0 w-100 px-3"
          style={{
            zIndex: 1000,
            left: "260px",
            width: "calc(100% - 260px)",
            borderBottom: "1px solid #eee",
          }}
        >
          <Container fluid className="d-flex justify-content-between align-items-center">
            {/* Marca y subtítulo */}
            <div className="d-flex align-items-center">
              <Navbar.Brand href="/admin" className="fw-bold text-primary fs-5 me-3">
                Municipalidad de Yau
              </Navbar.Brand>
              <span className="text-muted d-none d-md-inline">
                Sistema de Gestión Administrativa
              </span>
            </div>

            {/* Acciones a la derecha */}
            <div className="d-flex align-items-center gap-3">
              {/* Dropdown de notificaciones */}
              <div className="dropdown">
                <Button
                  variant="outline-primary"
                  className="rounded-circle position-relative dropdown-toggle"
                  id="dropdownNotificaciones"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaBell />
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.65rem" }}
                  >
                    3
                  </span>
                </Button>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm"
                  aria-labelledby="dropdownNotificaciones"
                  style={{ width: "280px" }}
                >
                  <li className="dropdown-header fw-semibold text-center">
                    🔔 Notificaciones recientes
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item small" href="#">
                      📝 Nuevo trámite registrado por el ciudadano #1243
                      <br />
                      <small className="text-muted">Hace 5 minutos</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item small" href="#">
                      ⚙️ Usuario “admin” actualizó la base de datos
                      <br />
                      <small className="text-muted">Hace 30 minutos</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item small" href="#">
                      📊 Reporte semanal disponible
                      <br />
                      <small className="text-muted">Hace 2 horas</small>
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li className="text-center">
                    <a className="dropdown-item text-primary fw-semibold" href="#">
                      Ver todas las notificaciones
                    </a>
                  </li>
                </ul>
              </div>

              {/* Perfil del usuario */}
              <div className="d-flex align-items-center">
                <img
                  src="/images/user-avatar.png"
                  alt="Usuario"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div className="d-none d-md-block">
                  <span className="fw-semibold text-dark d-block" style={{ lineHeight: "1" }}>
                    Funcionario
                  </span>
                  <small className="text-muted">Administrador</small>
                </div>
              </div>
            </div>
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
