import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState('crear'); 
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [formData, setFormData] = useState({ dni: '', nombre: '', email: '', password: '', rol: 'funcionario' });
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    if (!token) {
      Swal.fire('Sesión expirada', 'Inicia sesión nuevamente.', 'warning');
      setUsuarios([]);
      return;
    }
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setUsuarios(data);
      else Swal.fire('Error', data.error || 'Error al cargar usuarios', 'error');
    } catch (err) {
      Swal.fire('Error', 'Error de conexión con el servidor', 'error');
    } finally { setCargando(false); }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleGuardar = async () => {
    const url = modo === 'crear' ? 'http://localhost:3000/api/usuarios' : `http://localhost:3000/api/usuarios/${usuarioActual.id}`;
    const method = modo === 'crear' ? 'POST' : 'PUT';
    const body = modo === 'crear' ? formData : { dni: formData.dni, nombre: formData.nombre, email: formData.email, rol: formData.rol };

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('Éxito', 'Usuario guardado correctamente', 'success');
        cargarUsuarios();
        setShowModal(false);
      } else {
        Swal.fire('Error', data.error || 'Error al guardar usuario', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error de conexión', 'error');
    }
  };

  const handleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) Swal.fire('Éxito', `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'inactivado'}`, 'success');
      cargarUsuarios();
    } catch {
      Swal.fire('Error', 'Error al cambiar estado', 'error');
    }
  };

  const handleReiniciarPass = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}/password`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        Swal.fire('Contraseña reiniciada', `🔑 Nueva contraseña: ${data.passwordTemporal}\nIndique al usuario que la cambie`, 'info');
      }
    } catch {
      Swal.fire('Error', 'Error al reiniciar contraseña', 'error');
    }
  };
return (
  <div className="p-4">
    {/* Título y botón principal */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="fw-bold text-primary">👥 Gestión de Usuarios</h4>
      <Button
        variant="primary"
        className="shadow-sm fw-semibold"
        onClick={() => {
          setModo('crear');
          setFormData({
            dni: '',
            nombre: '',
            email: '',
            password: '',
            rol: 'funcionario'
          });
          setShowModal(true);
        }}
      >
        + Nuevo Usuario
      </Button>
    </div>

    {/* Tabla de usuarios */}
    {cargando ? (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando usuarios...</p>
      </div>
    ) : (
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table hover responsive bordered className="align-middle">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre_completo}</td>
                    <td>{u.dni}</td>
                    <td>{u.email}</td>
                    <td className="text-capitalize">{u.rol}</td>
                    <td>
                      <Badge bg={u.estado === 'activo' ? 'success' : 'secondary'}>
                        {u.estado}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => {
                          setModo('editar');
                          setUsuarioActual(u);
                          setFormData({
                            dni: u.dni,
                            nombre: u.nombre_completo,
                            email: u.email,
                            rol: u.rol
                          });
                          setShowModal(true);
                        }}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={u.estado === 'activo' ? 'outline-warning' : 'outline-success'}
                        className="me-2"
                        onClick={() => handleEstado(u.id, u.estado)}
                      >
                        {u.estado === 'activo' ? 'Inactivar' : 'Activar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleReiniciarPass(u.id)}
                      >
                        🔑 Reset Pass
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )}

    {/* Modal Crear/Editar */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {modo === 'crear' ? '➕ Crear Usuario' : '✏️ Editar Usuario'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">DNI</Form.Label>
            <Form.Control
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre</Form.Label>
            <Form.Control
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Form.Group>
          {modo === 'crear' && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label className="fw-semibold">Rol</Form.Label>
            <Form.Select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            >
              <option value="funcionario">Funcionario</option>
              <option value="administrador">Administrador</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
);
}