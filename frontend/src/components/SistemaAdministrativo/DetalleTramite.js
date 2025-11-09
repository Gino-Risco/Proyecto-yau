// src/components/SistemaAdministrativo/DetalleTramite.js
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert, Form, Modal, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetalleTramite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tramite, setTramite] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [estadoTemporal, setEstadoTemporal] = useState('');

  useEffect(() => {
    if (!id) {
      setMensaje('❌ ID no válido');
      setCargando(false);
      return;
    }
    cargarTramite();
  }, [id]);

  const cargarTramite = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${id}`);
      if (!res.ok) throw new Error('Trámite no encontrado');
      const data = await res.json();
      setTramite(data);
      setObservaciones(data.observaciones || '');
    } catch (error) {
      setMensaje('❌ ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarEstado = (nuevoEstado) => {
    setEstadoTemporal(nuevoEstado);
    setShowModal(true);
  };

  const confirmarActualizacion = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: estadoTemporal, observaciones: observaciones || null })
      });

      if (res.ok) {
        setTramite({ ...tramite, estado: estadoTemporal, observaciones: observaciones || null });
        setMensaje(`✅ Estado actualizado a "${estadoTemporal}"`);
        setShowModal(false);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando detalle del trámite...</p>
      </div>
    );
  }

  if (!tramite) {
    return <Alert variant="danger" className="text-center">{mensaje || 'Trámite no encontrado'}</Alert>;
  }

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="text-center">
          <h3 className="fw-bold mb-2">📋 Detalle del Trámite #{tramite.id}</h3>
          <p className="text-muted mb-0">Revisión y gestión administrativa del expediente</p>
        </Card.Body>
      </Card>

      {mensaje && (
        <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'} className="text-center">
          {mensaje}
        </Alert>
      )}

      {/* Información básica */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-primary text-white fw-bold">Información del Trámite</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>DNI:</strong> {tramite.dni}</p>
              <p><strong>Tipo:</strong> {tramite.tipo_tramite}</p>
              <p><strong>Prioridad:</strong>{' '}
                <Badge bg={
                  tramite.prioridad === 'alta' ? 'danger' :
                    tramite.prioridad === 'media' ? 'warning' : 'info'
                }>
                  {tramite.prioridad}
                </Badge>
              </p>
            </Col>
            <Col md={6}>
              <p><strong>Estado:</strong>{' '}
                <Badge bg={
                  tramite.estado === 'recibido' ? 'secondary' :
                    tramite.estado === 'en_proceso' ? 'primary' :
                      tramite.estado === 'resuelto' ? 'success' : 'danger'
                }>
                  {tramite.estado}
                </Badge>
              </p>
              {tramite.observaciones && (
                <div className="mt-2 p-2 bg-light rounded border">
                  <strong>Observaciones:</strong> <br />{tramite.observaciones}
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Documento original */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-secondary text-white fw-bold">Documento Original</Card.Header>
        <Card.Body className="text-center">
          {tramite.archivo_original.endsWith('.pdf') ? (
            <iframe
              src={`/uploads/${tramite.archivo_original}`}
              width="100%"
              height="500px"
              title="Documento PDF"
              className="border rounded"
            />
          ) : (
            <img
              src={`http://localhost:3000/uploads/${tramite.archivo_original}`}
              alt="Documento"
              style={{
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
          )}
        </Card.Body>
      </Card>

      {/* Texto OCR */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-info text-white fw-bold">Texto Extraído (OCR)</Card.Header>
        <Card.Body>
          <pre style={{
            whiteSpace: 'pre-wrap',
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '5px',
            fontSize: '0.95rem'
          }}>
            {tramite.contenido_texto}
          </pre>
        </Card.Body>
      </Card>

      {/* Acciones */}
      <div className="text-center my-4">
        {tramite.estado === 'recibido' && (
          <>
            <Button variant="primary" className="mx-2" onClick={() => handleActualizarEstado('en_proceso')}>
              En proceso
            </Button>
            <Button variant="danger" className="mx-2" onClick={() => handleActualizarEstado('rechazado')}>
              Rechazar
            </Button>
          </>
        )}
        {tramite.estado === 'en_proceso' && (
          <>
            <Button variant="success" className="mx-2" onClick={() => handleActualizarEstado('resuelto')}>
              Resolver
            </Button>
            <Button variant="danger" className="mx-2" onClick={() => handleActualizarEstado('rechazado')}>
              Rechazar
            </Button>
          </>
        )}
        {(tramite.estado === 'resuelto' || tramite.estado === 'rechazado') && (
          <p className={`fw-bold mt-3 ${tramite.estado === 'resuelto' ? 'text-success' : 'text-danger'}`}>
            {tramite.estado === 'resuelto' ? '✔️ Trámite resuelto' : '❌ Trámite rechazado'}
          </p>
        )}
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/admin/tramites')}>
            Volver a la lista
          </Button>
        </div>
      </div>

      {/* Modal para observaciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Observaciones para el estado "{estadoTemporal}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Escriba observaciones (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej: Falta documento de identidad, pendiente de revisión por Obras Públicas, etc."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmarActualizacion}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
