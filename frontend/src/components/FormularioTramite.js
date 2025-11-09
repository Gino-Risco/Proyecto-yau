// src/components/FormularioTramite.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function FormularioTramite() {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: ''
  });
  const [tipoEntrada, setTipoEntrada] = useState('texto'); // 'texto' o 'archivo'
  const [textoSolicitud, setTextoSolicitud] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'dni' ? value.replace(/\D/g, '').slice(0, 8) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.dni.length !== 8) {
      setMensaje('⚠️ El DNI debe tener 8 dígitos.');
      return;
    }

    setCargando(true);
    setMensaje('');

    const backendData = new FormData();
    backendData.append('dni', formData.dni);
    backendData.append('nombre', formData.nombre);
    backendData.append('email', formData.email);
    backendData.append('telefono', formData.telefono);

    if (tipoEntrada === 'texto') {
      if (!textoSolicitud.trim()) {
        setMensaje('⚠️ Ingrese el contenido de su solicitud.');
        setCargando(false);
        return;
      }
      const blob = new Blob([textoSolicitud], { type: 'text/plain' });
      backendData.append('documento', blob, 'solicitud.txt');
    } else {
      if (!archivo) {
        setMensaje('⚠️ Adjunte un documento.');
        setCargando(false);
        return;
      }
      backendData.append('documento', archivo);
    }

    try {
      const res = await fetch('http://localhost:3000/api/tramites', {
        method: 'POST',
        body: backendData,
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: '¡Trámite registrado!',
          text: `ID: ${data.id}\nEstado: ${data.estado}\n\nPuede consultar el estado de su trámite en cualquier momento ingresando su DNI.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        // Opcional: limpiar el formulario
        setFormData({ nombre: '', dni: '', email: '', telefono: '' });
        setTextoSolicitud('');
        setArchivo(null);
      } else {
        setMensaje(`❌ Error: ${data.error || 'No se pudo enviar el trámite'}`);
      }
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h4 className="mb-0">📝 Presentar Nuevo Trámite</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Datos personales */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nombre completo *</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">DNI (8 dígitos) *</label>
              <input
                type="text"
                className="form-control"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                maxLength={8}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          {/* Tipo de entrada */}
          <div className="mb-3">
            <label className="form-label">¿Cómo desea presentar su trámite?</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="texto"
                  className="form-check-input"
                  checked={tipoEntrada === 'texto'}
                  onChange={() => setTipoEntrada('texto')}
                />
                <label className="form-check-label" htmlFor="texto">Escribir solicitud</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="archivo"
                  className="form-check-input"
                  checked={tipoEntrada === 'archivo'}
                  onChange={() => setTipoEntrada('archivo')}
                />
                <label className="form-check-label" htmlFor="archivo">Subir documento</label>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {tipoEntrada === 'texto' ? (
            <div className="mb-3">
              <label className="form-label">Escriba su solicitud *</label>
              <textarea
                className="form-control"
                rows="6"
                value={textoSolicitud}
                onChange={(e) => setTextoSolicitud(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Adjuntar documento (PDF, JPG, PNG) *</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={(e) => setArchivo(e.target.files[0])}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar Trámite'}
          </button>

          {mensaje && (
            <div className={`mt-3 alert ${mensaje.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{mensaje}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}