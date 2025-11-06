import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Alert, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetalleTramite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tramite, setTramite] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!id) {
      setMensaje('❌ ID del trámite no proporcionado');
      setCargando(false);
      return;
    }
    cargarTramite();
  }, [id]);

  const cargarTramite = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${id}`);
      if (!res.ok) throw new Error('Error al cargar trámite');
      const data = await res.json();
      setTramite(data);
    } catch (error) {
      setMensaje('❌ ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) {
        setTramite({ ...tramite, estado: nuevoEstado });
        setMensaje(`✅ Trámite actualizado a "${nuevoEstado}"`);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        throw new Error('No se pudo actualizar el trámite');
      }
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  if (cargando) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if (!tramite) {
    return <Alert variant="danger">{mensaje || 'Trámite no encontrado'}</Alert>;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>📋 Detalle del Trámite #{tramite.id}</h4>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              ⬅️ Volver
            </Button>
          </div>

          {mensaje && (
            <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'}>
              {mensaje}
            </Alert>
          )}

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Información del Ciudadano</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>DNI:</strong> {tramite.dni}</p>
              <p><strong>Tipo de Trámite:</strong> {tramite.tipo_tramite}</p>
              <p>
                <strong>Prioridad:</strong>{' '}
                <Badge bg={
                  tramite.prioridad === 'alta' ? 'danger' :
                  tramite.prioridad === 'media' ? 'warning' : 'info'
                }>
                  {tramite.prioridad}
                </Badge>
              </p>
              <p>
                <strong>Estado:</strong>{' '}
                <Badge bg={
                  tramite.estado === 'recibido' ? 'secondary' :
                  tramite.estado === 'en_proceso' ? 'primary' :
                  tramite.estado === 'resuelto' ? 'success' : 'danger'
                }>
                  {tramite.estado}
                </Badge>
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Documento Original</h5>
            </Card.Header>
            <Card.Body className="text-center">
              {tramite.archivo_original.endsWith('.pdf') ? (
                <iframe
                  src={`http://localhost:3000/uploads/${tramite.archivo_original}`}
                  width="100%"
                  height="600px"
                  title="Documento PDF"
                  style={{ borderRadius: '8px', border: '1px solid #ddd' }}
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

          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Texto Extraído por OCR</h5>
            </Card.Header>
            <Card.Body>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  background: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #eee'
                }}
              >
                {tramite.contenido_texto}
              </pre>
            </Card.Body>
          </Card>

          <div className="d-flex gap-2 justify-content-end">
            {tramite.estado === 'recibido' && (
              <>
                <Button variant="primary" onClick={() => actualizarEstado('en_proceso')}>
                  En proceso
                </Button>
                <Button variant="danger" onClick={() => actualizarEstado('rechazado')}>
                  Rechazar
                </Button>
              </>
            )}
            {tramite.estado === 'en_proceso' && (
              <>
                <Button variant="success" onClick={() => actualizarEstado('resuelto')}>
                  Resolver
                </Button>
                <Button variant="danger" onClick={() => actualizarEstado('rechazado')}>
                  Rechazar
                </Button>
              </>
            )}
            {tramite.estado === 'resuelto' && (
              <Badge bg="success" className="p-2">✔️ Resuelto</Badge>
            )}
            {tramite.estado === 'rechazado' && (
              <Badge bg="danger" className="p-2">❌ Rechazado</Badge>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
