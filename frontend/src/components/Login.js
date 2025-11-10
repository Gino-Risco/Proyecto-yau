import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/admin/tramites');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">🔐 Iniciar Sesión - Municipalidad de Yau</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              type="text"
              className="form-control"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              maxLength={8}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
}