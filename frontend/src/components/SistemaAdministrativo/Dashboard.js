// src/components/SistemaAdministrativo/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMetricas();
  }, []);

  const cargarMetricas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/metricas');
      const data = await res.json();
      setMetricas(data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    } finally {
      setCargando(false);
    }
  };

if (cargando || !metricas) {
  return <div className="text-center py-5">Cargando dashboard...</div>;
}
  // Datos para gráficos
  const prioridadData = {
    labels: ['Alta', 'Media', 'Baja'],
    datasets: [{
      label: 'Trámites pendientes',
      data: [metricas.pendientes.alta, metricas.pendientes.media, metricas.pendientes.baja],
      backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6']
    }]
  };

  const tipoData = {
    labels: metricas.porTipo.map(t => t.tipo),
    datasets: [{
      label: 'Trámites por tipo',
      data: metricas.porTipo.map(t => t.cantidad),
      backgroundColor: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE']
    }]
  };

  return (
    <div>
      <h4 className="mb-4">📊 Dashboard - Gestión de Trámites</h4>

      {/* Métricas clave */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary display-6">{metricas.total}</Card.Title>
              <Card.Text>Total de trámites</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-danger display-6">{metricas.pendientes.alta}</Card.Title>
              <Card.Text>Pendientes - Alta</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-warning display-6">{metricas.resueltosHoy}</Card.Title>
              <Card.Text>Resueltos hoy</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-success display-6">{metricas.pendientes.media + metricas.pendientes.baja}</Card.Title>
              <Card.Text>Pendientes - Media/Baja</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h6 className="mb-0">Trámites pendientes por prioridad</h6>
            </Card.Header>
            <Card.Body>
              <Bar data={prioridadData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h6 className="mb-0">Trámites por tipo (Top 5)</h6>
            </Card.Header>
            <Card.Body>
              <Doughnut data={tipoData} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Últimos trámites */}
      <Card className="shadow-sm">
        <Card.Header>
          <h6 className="mb-0">Últimos trámites actualizados</h6>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ciudadano</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {metricas.ultimos.map(t => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.ciudadano}</td>
                  <td>{t.tipo}</td>
                  <td>
                    <span className={`badge bg-${t.estado === 'recibido' ? 'secondary' : t.estado === 'en_proceso' ? 'primary' : t.estado === 'resuelto' ? 'success' : 'danger'}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td>{new Date(t.fecha_actualizacion).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}