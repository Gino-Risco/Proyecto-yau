// src/components/SistemaAdministrativo/Dashboard.js
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMetricas();
  }, []);

  const cargarMetricas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/metricas");
      const data = await res.json();
      setMetricas(data);
    } catch (error) {
      console.error("Error al cargar métricas:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando || !metricas) {
    return <div className="text-center py-5 fs-5 text-muted">Cargando dashboard...</div>;
  }

  const prioridadData = {
    labels: ["Alta", "Media", "Baja"],
    datasets: [
      {
        label: "Trámites pendientes",
        data: [metricas.pendientes.alta, metricas.pendientes.media, metricas.pendientes.baja],
        backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6"],
        borderRadius: 8,
      },
    ],
  };

  const tipoData = {
    labels: metricas.porTipo.map((t) => t.tipo),
    datasets: [
      {
        label: "Trámites por tipo",
        data: metricas.porTipo.map((t) => t.cantidad),
        backgroundColor: ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
      },
    ],
  };

  return (
    <div className="p-4" style={{ background: "#f9fafb", minHeight: "100vh" }}>
      <h4 className="mb-4 fw-bold text-primary border-bottom pb-2">
        📊 Dashboard - Gestión de Trámites
      </h4>

      {/* Métricas clave */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-lg rounded-4 hover-shadow">
            <Card.Body>
              <h2 className="text-primary fw-bold">{metricas.total}</h2>
              <p className="text-muted mb-0">Total de trámites</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-lg rounded-4 hover-shadow">
            <Card.Body>
              <h2 className="text-danger fw-bold">{metricas.pendientes.alta}</h2>
              <p className="text-muted mb-0">Pendientes - Alta</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-lg rounded-4 hover-shadow">
            <Card.Body>
              <h2 className="text-warning fw-bold">{metricas.resueltosHoy}</h2>
              <p className="text-muted mb-0">Resueltos hoy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-lg rounded-4 hover-shadow">
            <Card.Body>
              <h2 className="text-success fw-bold">
                {metricas.pendientes.media + metricas.pendientes.baja}
              </h2>
              <p className="text-muted mb-0">Pendientes - Media/Baja</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-lg rounded-4 h-100">
            <Card.Header className="bg-white border-0 fw-semibold text-primary">
              Trámites pendientes por prioridad
            </Card.Header>
            <Card.Body>
              <Bar
                data={prioridadData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-lg rounded-4 h-100">
            <Card.Header className="bg-white border-0 fw-semibold text-primary">
              Trámites por tipo (Top 5)
            </Card.Header>
            <Card.Body>
              <Doughnut
                data={tipoData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "right" } },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Últimos trámites */}
      <Card className="border-0 shadow-lg rounded-4">
        <Card.Header className="bg-white border-0 fw-semibold text-primary">
          Últimos trámites actualizados
        </Card.Header>
        <Card.Body>
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Ciudadano</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {metricas.ultimos.map((t) => (
                <tr key={t.id}>
                  <td className="fw-semibold">#{t.id}</td>
                  <td>{t.ciudadano}</td>
                  <td>{t.tipo}</td>
                  <td>
                    <Badge
                      bg={
                        t.estado === "recibido"
                          ? "secondary"
                          : t.estado === "en_proceso"
                          ? "info"
                          : t.estado === "resuelto"
                          ? "success"
                          : "danger"
                      }
                      className="px-3 py-2 text-capitalize"
                    >
                      {t.estado.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {new Date(t.fecha_actualizacion).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
