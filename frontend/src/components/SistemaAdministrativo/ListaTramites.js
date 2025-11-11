// src/components/SistemaAdministrativo/ListaTramites.js
import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ListaTramites.css';

export default function ListaTramites() {
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  const [tramites, setTramites] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const cargarTramites = async () => {
    setCargando(true);
    setMensaje('');

    const params = new URLSearchParams();
    if (busqueda) params.append('q', busqueda);
    if (estado) params.append('estado', estado);
    if (prioridad) params.append('prioridad', prioridad);
    params.append('page', page);
    params.append('limit', limit);

    try {
      const res = await fetch(`http://localhost:3000/api/tramites?${params.toString()}`);
      if (!res.ok) throw new Error('Error al cargar trámites');
      const response = await res.json();

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Formato de respuesta inválido');
      }

      setTramites(response.data);
      setTotalItems(response.pagination?.totalItems || response.data.length);
    } catch (error) {
      console.error('Error en cargarTramites:', error);
      setMensaje('❌ No se pudieron cargar los trámites.');
      setTramites([]);
      setTotalItems(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTramites();
  }, [page, busqueda, estado, prioridad]);

  const handleFiltrar = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setEstado('');
    setPrioridad('');
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  const PrioridadBadge = ({ value }) => (
    <Badge
      bg={value === 'alta' ? 'danger' : value === 'media' ? 'warning' : 'info'}
      text={value === 'alta' ? 'light' : 'dark'}
    >
      {value}
    </Badge>
  );

  const EstadoBadge = ({ value }) => (
    <Badge
      bg={
        value === 'recibido'
          ? 'secondary'
          : value === 'en_proceso'
            ? 'primary'
            : value === 'resuelto'
              ? 'success'
              : 'danger'
      }
    >
      {value}
    </Badge>
  );

  return (
    <div className="lista-tramites-container">
      <h4 className="lista-tramites-title"> Gestión de Trámites</h4>

      {mensaje && <Alert variant="danger">{mensaje}</Alert>}

      {/* Filtros */}
      <Form onSubmit={handleFiltrar} className="mb-3 p-3 border rounded bg-light">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Control
              size="sm"
              placeholder="Buscar por nombre o DNI"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select size="sm" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="recibido">Recibido</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="rechazado">Rechazado</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select size="sm" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
              <option value="">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Col>
          <Col md={4} className="d-flex gap-1">
            <Button size="sm" variant="primary" type="submit">Aplicar filtros</Button>
            <Button size="sm" variant="outline-secondary" onClick={handleLimpiar}>Limpiar</Button>
          </Col>
        </Row>
      </Form>

      <p className="text-muted mb-2">
        Mostrando {tramites.length > 0 ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, totalItems)} de {totalItems} trámites
      </p>

      {cargando ? (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead className="table-light">
            <tr>
              <th>Ciudadano</th>
              <th>DNI</th>
              <th>Tipo de Trámite</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha Ingreso</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {tramites.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No se encontraron trámites.</td>
              </tr>
            ) : (
              tramites.map((t) => (
                <tr key={t.id}>
                  <td>{t.ciudadano_nombre}</td>
                  <td>{t.dni}</td>
                  <td>{t.tipo_tramite}</td>
                  <td><PrioridadBadge value={t.prioridad} /></td>
                  <td><EstadoBadge value={t.estado} /></td>
                  <td>{new Date(t.fecha_ingreso).toLocaleString()}</td>
                  <td className="text-center">
                    <Link to={`/admin/tramites/${t.id}`}>
                      <Button size="sm" variant="outline-primary">Ver</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button size="sm" variant="outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>← Anterior</Button>
          <span className="text-muted">Página {page} de {totalPages}</span>
          <Button size="sm" variant="outline-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente →</Button>
        </div>
      )}
    </div>
  );
}
