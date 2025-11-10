// src/components/FormularioTramite.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


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
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h2 className="fw-bold text-primary text-center mb-4">
        Presentar su Trámite en Línea
      </h2>
      <p className="text-muted text-center mb-5">
        Complete los siguientes campos para registrar su solicitud en línea.
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Datos personales */}
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">
              Nombre completo *
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">
              DNI (8 dígitos) *
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              maxLength={8}
              required
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">
              Teléfono
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="telefono"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  telefono: e.target.value.replace(/\D/g, ""),
                })
              }
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        </div>

        {/* Tipo de entrada */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-dark">
            ¿Cómo desea presentar su trámite?
          </label>
          <div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="texto"
                className="form-check-input"
                checked={tipoEntrada === "texto"}
                onChange={() => setTipoEntrada("texto")}
              />
              <label className="form-check-label" htmlFor="texto">
                Escribir solicitud
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="archivo"
                className="form-check-input"
                checked={tipoEntrada === "archivo"}
                onChange={() => setTipoEntrada("archivo")}
              />
              <label className="form-check-label" htmlFor="archivo">
                Subir documento
              </label>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {tipoEntrada === "texto" ? (
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">
              Escriba su solicitud *
            </label>
            <textarea
              className="form-control form-control-lg"
              rows="6"
              value={textoSolicitud}
              onChange={(e) => setTextoSolicitud(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">
              Adjuntar documento (PDF, JPG, PNG) *
            </label>
            <input
              type="file"
              className="form-control form-control-lg"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={(e) => setArchivo(e.target.files[0])}
              required
              style={{
                borderRadius: "10px",
                border: "1px solid #ccc",
                backgroundColor: "#f8f9fa",
              }}
            />
          </div>
        )}

        {/* Botón */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary btn-lg px-5"
            disabled={cargando}
            style={{
              borderRadius: "10px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {cargando ? "Enviando..." : "Enviar Trámite"}
          </button>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-primary fw-semibold"
            style={{
              textDecoration: "none",
            }}
          >
            ← Regresar
          </Link>
        </div>


        {mensaje && (
          <div
            className={`mt-4 alert ${mensaje.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            style={{
              borderRadius: "10px",
              fontWeight: "500",
            }}
          >
            <pre style={{ whiteSpace: "pre-wrap" }}>{mensaje}</pre>
          </div>
        )}
      </form>
    </div>
  );
}