import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reportes() {
  const [tipo, setTipo] = useState('productividad');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datos, setDatos] = useState({});

  const cargarReporte = async () => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const res = await fetch(`http://localhost:3000/api/reportes/${tipo}?${params}`);
      const data = await res.json();
      setDatos(data || {});
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      setDatos({});
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Gestión', 14, 20);
    doc.setFontSize(12);
    doc.text(`Periodo: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`, 14, 30);

    if (tipo === 'productividad') {
      const tabla = [
        ['Métrica', 'Valor'],
        ['Trámites recibidos', datos.recibidos || 0],
        ['Trámites resueltos', datos.resueltos || 0],
        ['Tiempo promedio (días)', datos.diasPromedio || 0],
        ['Trámites vencidos', datos.vencidos || 0],
      ];

      autoTable(doc, {
        head: [tabla[0]],
        body: tabla.slice(1),
        startY: 40,
      });
    }

    doc.save(`reporte_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const datosTipo = Array.isArray(datos) ? datos : datos?.data || [];

  return (
    <div className="p-4">
      <h4 className="mb-4 fw-bold text-primary">📊 Reportes de Gestión</h4>

      {/* Filtros */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label className="fw-semibold">Tipo de Reporte</Form.Label>
              <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="productividad">Productividad y Cumplimiento</option>
                <option value="tipo">Por Tipo de Trámite</option>
                <option value="criticos">Trámites Críticos</option>
                <option value="calidad">Indicadores de Calidad</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">Desde</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold">Hasta</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Button variant="primary" className="w-100" onClick={cargarReporte}>
                Generar Reporte
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Resultados */}
      {datos && Object.keys(datos).length > 0 && (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Resultados del Reporte</span>
            <Button size="sm" variant="outline-primary" onClick={exportarPDF}>
              📄 Exportar PDF
            </Button>
          </Card.Header>
          <Card.Body>
            {/* Productividad */}
            {tipo === 'productividad' && (
              <Row className="g-3">
                <Col md={3}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-primary">{datos.recibidos || 0}</h4>
                    <p className="mb-0">Trámites Recibidos</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-success">{datos.resueltos || 0}</h4>
                    <p className="mb-0">Resueltos</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-secondary">{datos.diasPromedio || 0}</h4>
                    <p className="mb-0">Días Promedio</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-danger">{datos.vencidos || 0}</h4>
                    <p className="mb-0">Vencidos</p>
                  </div>
                </Col>
              </Row>
            )}

            {/* Por tipo */}
            {tipo === 'tipo' && (
              <div>
                <h6 className="fw-bold mb-3 text-secondary">Distribución por Tipo de Trámite</h6>
                <Table striped hover responsive bordered className="align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>Tipo de Trámite</th>
                      <th>Cantidad</th>
                      <th>Rechazados</th>
                      <th>% Rechazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosTipo.map((item, i) => (
                      <tr key={i}>
                        <td>{item.tipo}</td>
                        <td>{item.cantidad}</td>
                        <td className="text-danger fw-semibold">{item.rechazados}</td>
                        <td>{item.porcentajeRechazo}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Críticos */}
            {tipo === 'criticos' && (
              <Row className="g-3">
                <Col md={4}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-warning">{datos.totalCriticos || 0}</h4>
                    <p className="mb-0">Críticos Recibidos</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-success">{datos.resueltosEn48h || 0}</h4>
                    <p className="mb-0">Resueltos en 48h</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 text-center bg-white border rounded shadow-sm">
                    <h4 className="fw-bold text-danger">{datos.pendientesCriticos || 0}</h4>
                    <p className="mb-0">Pendientes 3 días</p>
                  </div>
                </Col>
              </Row>
            )}

            {/* Calidad */}
            {tipo === 'calidad' && (
              <>
                <Row className="g-3">
                  <Col md={4}>
                    <div className="p-3 text-center bg-white border rounded shadow-sm">
                      <h4 className="fw-bold text-info">{datos.reingresados || 0}</h4>
                      <p className="mb-0">Reingresados</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3 text-center bg-white border rounded shadow-sm">
                      <h4 className="fw-bold text-warning">{datos.porcentajeConObservaciones || 0}%</h4>
                      <p className="mb-0">Con Observaciones</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3 text-center bg-white border rounded shadow-sm">
                      <h4 className="fw-bold text-danger">{datos.observacionesNegativas?.length || 0}</h4>
                      <p className="mb-0">Motivos Frecuentes</p>
                    </div>
                  </Col>
                </Row>
                {datos.observacionesNegativas?.length > 0 && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Motivos Frecuentes de Rechazo:</h6>
                    <ul className="mb-0">
                      {datos.observacionesNegativas.map((obs, i) => (
                        <li key={i}>
                          <strong>{obs.motivo}</strong>: {obs.cantidad} veces
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
