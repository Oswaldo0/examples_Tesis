import React, { useState, useEffect } from "react";
import { coordinadoresApi } from "../services/api";

const Professors = () => {
  const [coordinadores, setCoordinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    coordinadoresApi.getAll()
      .then(setCoordinadores)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Catedráticos / Coordinadores</h2>

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && coordinadores.length === 0 && (
        <p>No hay coordinadores registrados en la base de datos.</p>
      )}

      {!loading && !error && coordinadores.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>ID</th>
              <th style={{ padding: '8px 12px' }}>Correo</th>
              <th style={{ padding: '8px 12px' }}>Estado</th>
              <th style={{ padding: '8px 12px' }}>Año asignación</th>
              <th style={{ padding: '8px 12px' }}>ID Facultad</th>
            </tr>
          </thead>
          <tbody>
            {coordinadores.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>{c.id}</td>
                <td style={{ padding: '8px 12px' }}>{c.correo}</td>
                <td style={{ padding: '8px 12px' }}>{c.estado}</td>
                <td style={{ padding: '8px 12px' }}>{c.anio_asignacion}</td>
                <td style={{ padding: '8px 12px' }}>{c.id_facultad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Professors;
