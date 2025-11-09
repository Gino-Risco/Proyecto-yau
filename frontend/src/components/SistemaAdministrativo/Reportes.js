// src/components/SistemaAdministrativo/Reportes.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reportes() {
    const [tipo, setTipo] = useState('productividad');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [datos, setDatos] = useState(null);

    const cargarReporte = async () => {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);

        const res = await fetch(`http://localhost:3000/api/reportes/${tipo}?${params}`);
        const data = await res.json();
        setDatos(data);
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Reporte de Productividad', 14, 20);
        doc.setFontSize(12);
        doc.text(`Periodo: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}`, 14, 30);

        const tabla = [
            ['Métrica', 'Valor'],
            ['Trámites recibidos', datos.recibidos],
            ['Trámites resueltos', datos.resueltos],
            ['Tiempo promedio (días)', datos.promedioDias],
            ['Trámites vencidos', datos.vencidos]
        ];

        autoTable(doc, {
            head: [tabla[0]],
            body: tabla.slice(1),
            startY: 40,
        });


        doc.save(`reporte_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

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

            {datos && (
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
                        <Row>
                            <Col md={3}>
                                <div className="text-center p-3 border rounded">
                                    <h5>{datos.recibidos}</h5>
                                    <p>Trámites recibidos</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="text-center p-3 border rounded">
                                    <h5 className="text-success">{datos.resueltos}</h5>
                                    <p>Resueltos</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="text-center p-3 border rounded">
                                    <h5>{datos.promedioDias}</h5>
                                    <p>Días promedio</p>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="text-center p-3 border rounded">
                                    <h5 className="text-danger">{datos.vencidos}</h5>
                                    <p>Vencidos</p>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}