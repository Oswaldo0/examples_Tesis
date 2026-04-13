import React, { useState, useEffect } from 'react';
import '../styles/Students.css';
import Login from '../components/Login';
import userAvatar from '../assets/user-avatar.svg';
import { studentsApi, materiasApi } from '../services/api';

const Students = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('curso');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([studentsApi.getAll(), materiasApi.getAll()])
      .then(([sts, mats]) => {
        setStudents(sts);
        if (sts.length > 0) setSelected(sts[0]);
        setMaterias(mats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setCurrentPage('maintenance');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'curso':
        return (
          <div className="tab-content">
            <h3>Información del Curso</h3>
            {selected ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {selected.id_carrera && <tr><td><strong>ID Carrera:</strong></td><td>{selected.id_carrera}</td></tr>}
                  {selected.anio_ingreso && <tr><td><strong>Año de ingreso:</strong></td><td>{selected.anio_ingreso}</td></tr>}
                  {selected.estado_academico && <tr><td><strong>Estado académico:</strong></td><td>{selected.estado_academico}</td></tr>}
                  {selected.institucion_proc && <tr><td><strong>Institución proc.:</strong></td><td>{selected.institucion_proc}</td></tr>}
                  {selected.calidad && <tr><td><strong>Calidad:</strong></td><td>{selected.calidad}</td></tr>}
                  {selected.empleo && <tr><td><strong>Empleo:</strong></td><td>{selected.empleo}</td></tr>}
                </tbody>
              </table>
            ) : <p>No hay datos del curso.</p>}
          </div>
        );
      case 'materias':
        return (
          <div className="tab-content">
            <h3>Materias ({materias.length})</h3>
            {materias.length === 0 ? (
              <p>No hay materias registradas.</p>
            ) : (
              <div className="subjects-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {materias.map((m) => (
                  <div key={m.id} className="subject-card" style={{ minWidth: '180px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 6px 0' }}>📖 {m.nombre}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Estado: <strong>{m.estado}</strong>
                    </p>
                    {m.descripcion && <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>{m.descripcion}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'cum':
        return (
          <div className="tab-content">
            <h3>CUM (Coeficiente de Utilización de Materias)</h3>
            {selected ? (
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                {selected.cum ?? 'No registrado'}
              </p>
            ) : <p>Sin estudiante seleccionado.</p>}
          </div>
        );
      case 'horario':
        return (
          <div className="tab-content">
            <h3>Horario Personal</h3>
            <p>Próximamente disponible.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="students-container">
      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'curso' ? 'active' : ''}`} onClick={() => setActiveTab('curso')}>📚 Curso</button>
        <button className={`tab-button ${activeTab === 'materias' ? 'active' : ''}`} onClick={() => setActiveTab('materias')}>📖 Materias</button>
        <button className={`tab-button ${activeTab === 'cum' ? 'active' : ''}`} onClick={() => setActiveTab('cum')}>📊 CUM</button>
        <button className={`tab-button ${activeTab === 'horario' ? 'active' : ''}`} onClick={() => setActiveTab('horario')}>📅 Horario</button>
        <button className="tab-button" onClick={() => setShowLoginModal(true)}>🔧 Mantenimiento</button>
      </div>

      {loading && <p style={{ padding: '1rem' }}>Cargando datos…</p>}
      {error && <p style={{ padding: '1rem', color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="students-layout">
          <aside className="profile-panel">
            <div className="profile-header">
              <div className="photo-section">
                <img src={userAvatar} alt="Foto del estudiante" className="profile-photo" />
              </div>
              {selected ? (
                <>
                  <h3>{selected.nombres} {selected.apellidos}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    Expediente: <strong>{selected.expediente}</strong>
                  </p>
                </>
              ) : <h3>Sin estudiantes</h3>}
            </div>

            {students.length > 1 && (
              <div style={{ padding: '0 1rem 0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Seleccionar estudiante</label>
                <select
                  style={{ width: '100%', marginTop: '4px', padding: '4px', borderRadius: '4px' }}
                  onChange={(e) => setSelected(students.find((s) => s.expediente === e.target.value))}
                  value={selected?.expediente ?? ''}
                >
                  {students.map((s) => (
                    <option key={s.expediente} value={s.expediente}>
                      {s.nombres} {s.apellidos} ({s.expediente})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selected && (
              <div className="profile-details">
                <p><strong>Estado:</strong> {selected.estado_academico ?? 'N/A'}</p>
                <p><strong>Año de Inscripción:</strong> {selected.anio_ingreso ?? 'N/A'}</p>
                <p><strong>Teléfono:</strong> {selected.telefono ?? 'N/A'}</p>
                <p><strong>Correo:</strong> {selected.correo ?? 'N/A'}</p>
              </div>
            )}
          </aside>
          <section className="students-content">
            {renderContent()}
          </section>
        </div>
      )}

      {showLoginModal && <Login onLogin={handleLoginSuccess} onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default Students;
