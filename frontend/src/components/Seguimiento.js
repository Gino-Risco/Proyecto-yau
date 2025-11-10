// src/components/Seguimiento.js
import React, { useState } from 'react';
import { Card, Button, Alert, Spinner, Modal, Badge } from 'react-bootstrap';


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
    } catch (error) {
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
    } catch (error) {
      setMensaje('❌ Error al cargar el detalle del trámite');
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h4 className="mb-0">🔍 Consultar Estado de Trámite</h4>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="dniConsulta" className="form-label">Ingrese su DNI (8 dígitos)</label>
          <input
            type="text"
            className="form-control"
            id="dniConsulta"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
            maxLength={8}
          />
        </div>

        <Button
          className="btn btn-success w-100 mb-3"
          onClick={handleConsultar}
          disabled={cargando}
        >
          {cargando ? 'Consultando...' : 'Consultar Trámites'}
        </Button>

        {mensaje && <Alert className="mt-3">{mensaje}</Alert>}

        {tramites.length > 0 && (
          <div>
            <h6>📋 Trámites encontrados:</h6>
            <div className="row g-3">
              {tramites.map((t) => (
                <div key={t.id} className="col-md-6">
                  <Card
                    className="shadow-sm h-100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => abrirDetalle(t)}
                  >
                    <Card.Body>
                      <strong>ID:</strong> {t.id} • <strong>Tipo:</strong> {t.tipo_tramite}
                      <br />
                      <span className={`badge bg-${t.prioridad === 'alta' ? 'danger' : t.prioridad === 'media' ? 'warning' : 'info'} me-2`}>
                        {t.prioridad}
                      </span>
                      <span className={`badge bg-${t.estado === 'recibido' ? 'secondary' : t.estado === 'en_proceso' ? 'primary' : t.estado === 'resuelto' ? 'success' : 'danger'}`}>
                        {t.estado}
                      </span>
                      <br />
                      <small className="text-muted">{new Date(t.fecha_ingreso).toLocaleString()}</small>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de detalle */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="mx-auto">📋 Detalle del Trámite #{tramiteActual?.id}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {tramiteActual && (
              <div className="d-flex flex-column gap-4 align-items-center">

                {/* Datos principales */}
                <div className="p-4 bg-light rounded shadow-sm w-100" style={{ maxWidth: '600px' }}>
                  <p><strong>DNI:</strong> {tramiteActual.dni}</p>
                  <p><strong>Tipo de Trámite:</strong> {tramiteActual.tipo_tramite}</p>
                  <p>
                    <strong>Prioridad:</strong>{' '}
                    <Badge
                      pill
                      bg={tramiteActual.prioridad === 'alta' ? 'danger' : tramiteActual.prioridad === 'media' ? 'warning' : 'info'}
                    >
                      {tramiteActual.prioridad}
                    </Badge>
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <Badge
                      pill
                      bg={tramiteActual.estado === 'recibido' ? 'secondary' : tramiteActual.estado === 'en_proceso' ? 'primary' : tramiteActual.estado === 'resuelto' ? 'success' : 'danger'}
                    >
                      {tramiteActual.estado}
                    </Badge>
                  </p>
                  <p><strong>Fecha de ingreso:</strong> {new Date(tramiteActual.fecha_ingreso).toLocaleString()}</p>
                </div>

                {/* Observaciones */}
                {tramiteActual?.observaciones && (
                  <div className="p-3 bg-light rounded border-start border-4 border-primary shadow-sm w-100" style={{ maxWidth: '600px' }}>
                    <strong>Observaciones del funcionario:</strong>
                    <p className="mb-0">{tramiteActual.observaciones}</p>
                  </div>
                )}

                {/* Documento original */}
                <div className="p-3 bg-white rounded shadow-sm border w-100" style={{ maxWidth: '600px' }}>
                  <h6>📄 Documento Original</h6>
                  {tramiteActual.archivo_original ? (
                    tramiteActual.archivo_original.endsWith('.pdf') ? (
                      <iframe
                        src={`/uploads/${tramiteActual.archivo_original}`}
                        width="100%"
                        height="400px"
                        title="Documento PDF"
                        style={{ border: '1px solid #ccc', borderRadius: '6px' }}
                      />
                    ) : tramiteActual.archivo_original.endsWith('.txt') ? (
                      <div className="p-3 bg-light rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: '1rem', borderRadius: '5px' }}>
                          {tramiteActual.contenido_texto}
                        </pre>
                      </div>
                    ) : (
                      <img
                        src={`http://localhost:3000/uploads/${tramiteActual.archivo_original}`}
                        alt="Documento"
                        className="d-block mx-auto"

                        style={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    )
                  ) : (
                    <p className="text-muted">No hay documento adjunto. Trámite ingresado por texto.</p>
                  )}
                </div>

              </div>
            )}
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            <Button variant="primary" onClick={() => setShowModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}