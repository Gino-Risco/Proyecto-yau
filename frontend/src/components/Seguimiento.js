import React, { useState } from 'react';
import { Card, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // ✅ Para volver al inicio

export default function Seguimiento() {
  const [dni, setDni] = useState('');
  const [tramites, setTramites] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tramiteActual, setTramiteActual] = useState(null);

  const handleConsultar = async () => {
    if (dni.length !== 8) {
      setMensaje('⚠️ Ingrese un DNI válido (8 dígitos).');
      return;
    }

    setCargando(true);
    setMensaje('');
    setTramites([]);

    try {
      const res = await fetch(`http://localhost:3000/api/tramites/dni/${dni}`);
      const data = await res.json();

      if (res.ok) {
        setTramites(data);
        if (data.length === 0) {
          setMensaje('📭 No se encontraron trámites para este DNI.');
        }
      } else {
        setMensaje(`❌ ${data.error || 'Error al consultar'}`);
      }
    } catch {
      setMensaje('❌ Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const abrirDetalle = async (tramite) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${tramite.id}`);
      const data = await res.json();
      setTramiteActual(data);
      setShowModal(true);
    } catch {
      setMensaje('❌ Error al cargar el detalle del trámite');
    }
  };

  return (
    <div className="container py-5">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary"> Seguimiento de Trámites</h2>
        <p className="text-muted">Consulte el estado actual de sus solicitudes ingresando su DNI</p>
      </div>

      {/* Campo de búsqueda */}
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <label htmlFor="dniConsulta" className="form-label fw-semibold">
          DNI (8 dígitos)
        </label>
        <input
          type="text"
          id="dniConsulta"
          className="form-control form-control-lg mb-3 shadow-sm"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
          placeholder="Ingrese su DNI"
          maxLength={8}
        />
        <Button
          variant="success"
          className="w-100 py-2"
          onClick={handleConsultar}
          disabled={cargando}
        >
          {cargando ? 'Consultando...' : 'Consultar'}
        </Button>
        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none text-primary fw-semibold">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <Alert variant="info" className="mt-4 text-center mx-auto" style={{ maxWidth: '600px' }}>
          {mensaje}
        </Alert>
      )}

      {/* Resultados */}
      {tramites.length > 0 && (
        <div className="mt-5">
          <h5 className="fw-bold text-secondary mb-3"> Trámites encontrados</h5>
          <div className="row g-4">
            {tramites.map((t) => (
              <div key={t.id} className="col-md-6 col-lg-4">
                <Card
                  className="h-100 border-0 shadow-sm hover-shadow-sm transition"
                  style={{ cursor: 'pointer' }}
                  onClick={() => abrirDetalle(t)}
                >
                  <Card.Body>
                    <h6 className="fw-bold text-primary mb-1">#{t.id} • {t.tipo_tramite}</h6>
                    <div className="mb-2">
                      <Badge
                        bg={
                          t.prioridad === 'alta'
                            ? 'danger'
                            : t.prioridad === 'media'
                            ? 'warning'
                            : 'info'
                        }
                        className="me-2"
                      >
                        {t.prioridad}
                      </Badge>
                      <Badge
                        bg={
                          t.estado === 'recibido'
                            ? 'secondary'
                            : t.estado === 'en_proceso'
                            ? 'primary'
                            : t.estado === 'resuelto'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        {t.estado}
                      </Badge>
                    </div>
                    <small className="text-muted">
                      {new Date(t.fecha_ingreso).toLocaleString()}
                    </small>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title> Detalle del Trámite #{tramiteActual?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light">
          {tramiteActual && (
            <div className="p-3">
              <p><strong>DNI:</strong> {tramiteActual.dni}</p>
              <p><strong>Tipo:</strong> {tramiteActual.tipo_tramite}</p>
              <p>
                <strong>Prioridad:</strong>{' '}
                <Badge
                  bg={
                    tramiteActual.prioridad === 'alta'
                      ? 'danger'
                      : tramiteActual.prioridad === 'media'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {tramiteActual.prioridad}
                </Badge>
              </p>
              <p>
                <strong>Estado:</strong>{' '}
                <Badge
                  bg={
                    tramiteActual.estado === 'recibido'
                      ? 'secondary'
                      : tramiteActual.estado === 'en_proceso'
                      ? 'primary'
                      : tramiteActual.estado === 'resuelto'
                      ? 'success'
                      : 'danger'
                  }
                >
                  {tramiteActual.estado}
                </Badge>
              </p>
              <p><strong>Fecha:</strong> {new Date(tramiteActual.fecha_ingreso).toLocaleString()}</p>

              {tramiteActual.observaciones && (
                <div className="p-3 bg-white rounded border-start border-4 border-primary shadow-sm mt-3">
                  <strong>Observaciones:</strong>
                  <p className="mb-0">{tramiteActual.observaciones}</p>
                </div>
              )}

              {/* Documento */}
              <div className="p-3 bg-white rounded shadow-sm border mt-4">
                <h6 className="fw-bold mb-3">Documento Original</h6>
                {tramiteActual.archivo_original ? (
                  tramiteActual.archivo_original.endsWith('.pdf') ? (
                    <iframe
                      src={`/uploads/${tramiteActual.archivo_original}`}
                      width="100%"
                      height="400"
                      title="Documento PDF"
                      className="rounded"
                      style={{ border: '1px solid #ccc' }}
                    />
                  ) : tramiteActual.archivo_original.endsWith('.txt') ? (
                    <pre
                      className="bg-light p-3 rounded"
                      style={{ maxHeight: '400px', overflowY: 'auto' }}
                    >
                      {tramiteActual.contenido_texto}
                    </pre>
                  ) : (
                    <img
                      src={`http://localhost:3000/uploads/${tramiteActual.archivo_original}`}
                      alt="Documento"
                      className="d-block mx-auto rounded border"
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  )
                ) : (
                  <p className="text-muted">No se adjuntó ningún documento.</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
