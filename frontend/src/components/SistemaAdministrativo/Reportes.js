// src/components/SistemaAdministrativo/Reportes.js
import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reportes() {
    const [tipo, setTipo] = useState('productividad');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [datos, setDatos] = useState({}); // Inicializamos como objeto vacío

    const cargarReporte = async () => {
        try {
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);

            const res = await fetch(`http://localhost:3000/api/reportes/${tipo}?${params}`);
            const data = await res.json();
            setDatos(data || {}); // Seguridad ante respuestas vacías
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

    // Para el reporte tipo "tipo de trámite" aseguramos un array
    const datosTipo = Array.isArray(datos) ? datos : datos?.data || [];

    return (
        <div>
            <h4 className="mb-4">📊 Reportes de Gestión</h4>

            <Card className="mb-4">
                <Card.Body>
                    <Row className="g-3">
                        <Col md={3}>
                            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                                <option value="productividad">Productividad y Cumplimiento</option>
                                <option value="tipo">Por Tipo de Trámite</option>
                                <option value="criticos">Trámites Críticos</option>
                                <option value="calidad">Indicadores de Calidad</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                placeholder="Fecha inicio"
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                placeholder="Fecha fin"
                            />
                        </Col>
                        <Col md={3}>
                            <Button variant="primary" onClick={cargarReporte} className="w-100">
                                Generar Reporte
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {datos && Object.keys(datos).length > 0 && (
                <Card>
                    <Card.Header>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Resultados</span>
                            <Button size="sm" variant="outline-secondary" onClick={exportarPDF}>
                                📄 Exportar a PDF
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {/* Reporte 1: Productividad */}
                        {tipo === 'productividad' && (
                            <Row>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h5>{datos.recibidos || 0}</h5>
                                        <p>Trámites recibidos</p>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h5 className="text-success">{datos.resueltos || 0}</h5>
                                        <p>Resueltos</p>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h5>{datos.diasPromedio || 0}</h5>
                                        <p>Días promedio</p>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="text-center p-3 border rounded">
                                        <h5 className="text-danger">{datos.vencidos || 0}</h5>
                                        <p>Vencidos</p>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Reporte 2: Por Tipo de Trámite */}
                        {tipo === 'tipo' && (
                            <div>
                                <h6 className="mb-3">Distribución por tipo de trámite</h6>
                                <Table striped bordered hover size="sm">
                                    <thead>
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
                                                <td className="text-danger">{item.rechazados}</td>
                                                <td>{item.porcentajeRechazo}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* Reporte 3: Trámites Críticos */}
                        {tipo === 'criticos' && (
                            <Row>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5 className="text-warning">{datos.totalCriticos || 0}</h5>
                                        <p>Críticos recibidos</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5 className="text-success">{datos.resueltosEn48h || 0}</h5>
                                        <p>Resueltos en 48h</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5 className="text-danger">{datos.pendientesCriticos || 0}</h5>
                                        <p>Pendientes 3 días</p>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Reporte 4: Indicadores de Calidad */}
                        {tipo === 'calidad' && (
                            <Row>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5>{datos.reingresados || 0}</h5>
                                        <p>Trámites reingresados</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5>{datos.porcentajeConObservaciones || 0}%</h5>
                                        <p>Con observaciones</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-center p-3 border rounded">
                                        <h5>{datos.observacionesNegativas?.length || 0}</h5>
                                        <p>Motivos frecuentes</p>
                                    </div>
                                </Col>
                                {datos.observacionesNegativas?.length > 0 && (
                                    <Col md={12} className="mt-3">
                                        <h6>Motivos frecuentes de rechazo:</h6>
                                        <ul>
                                            {datos.observacionesNegativas.map((obs, i) => (
                                                <li key={i}>
                                                    <strong>{obs.motivo}</strong>: {obs.cantidad} veces
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                )}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}
