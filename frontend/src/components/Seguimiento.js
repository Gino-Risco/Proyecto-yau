// src/components/Seguimiento.js
import React, { useState } from 'react';

export default function Seguimiento() {
  const [dni, setDni] = useState('');
  const [tramites, setTramites] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleConsultar = async () => {
    if (dni.length !== 8) {
      setMensaje('⚠️ Ingrese un DNI válido de 8 dígitos.');
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

  const prioridadBadge = (prioridad) => {
    const bg = { alta: 'danger', media: 'warning', baja: 'info' }[prioridad] || 'secondary';
    return <span className={`badge bg-${bg} ms-2`}>{prioridad}</span>;
  };

  const estadoBadge = (estado) => {
    const bg = { recibido: 'secondary', en_proceso: 'primary', resuelto: 'success', rechazado: 'danger' }[estado] || 'secondary';
    return <span className={`badge bg-${bg} ms-2`}>{estado}</span>;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h4 className="mb-0">🔍 Consultar Estado de Trámite</h4>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Ingrese su DNI (8 dígitos)</label>
          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
            maxLength={8}
          />
        </div>
        <button
          className="btn btn-success w-100 mb-3"
          onClick={handleConsultar}
          disabled={cargando}
        >
          {cargando ? 'Consultando...' : 'Consultar Trámites'}
        </button>

        {mensaje && <div className="alert alert-info">{mensaje}</div>}

        {tramites.length > 0 && (
          <div>
            <h6 className="mt-3">📋 Trámites encontrados:</h6>
            <div className="list-group">
              {tramites.map((t) => (
                <div key={t.id} className="list-group-item">
                  <strong>ID:</strong> {t.id} • <strong>Tipo:</strong> {t.tipo_tramite}
                  {prioridadBadge(t.prioridad)}
                  {estadoBadge(t.estado)}
                  <br />
                  <small className="text-muted">{new Date(t.fecha_ingreso).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}