// src/components/SistemaAdministrativo/ListaTramites.js
import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ListaTramites.css';


export default function ListaTramites() {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarTramites();
  }, []);

  const cargarTramites = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tramites');
      if (!res.ok) throw new Error('Error al cargar trámites');
      const data = await res.json();
      setTramites(data);
    } catch (error) {
      setMensaje('❌ ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tramites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (res.ok) {
        cargarTramites(); // Recargar lista
        setMensaje(`✅ Trámite #${id} actualizado a "${nuevoEstado}"`);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        throw new Error('No se pudo actualizar el trámite');
      }
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  if (cargando) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="lista-tramites-container">
      <h4 className="lista-tramites-title">📋 Gestión de Trámites</h4>

      {mensaje && (
        <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'}>
          {mensaje}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Ciudadano</th>
            <th>DNI</th>
            <th>Tipo de Trámite</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map((t) => (
            <tr key={t.id}>
              <td>{t.nombre_completo}</td>
              <td>{t.dni}</td>
              <td>{t.tipo_tramite}</td>
              <td>
                <Badge
                  bg={
                    t.prioridad === 'alta'
                      ? 'danger'
                      : t.prioridad === 'media'
                        ? 'warning'
                        : 'info'
                  }
                  text={t.prioridad === 'alta' ? 'light' : 'dark'}
                >
                  {t.prioridad}
                </Badge>
              </td>
              <td>
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
              </td>
              <td className="text-center">
                <Link to={`/admin/tramites/${t.id}`}>
                  <Button size="sm" variant="outline-primary">Ver</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}