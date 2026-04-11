import React, { useState } from 'react';
import '../styles/Students.css';

const Students = ({ setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('curso');

  const renderContent = () => {
    switch (activeTab) {
      case 'curso':
        return (
          <div className="tab-content">
            <h3>Información del Curso</h3>
            <p>Detalles del curso actual del estudiante.</p>
          </div>
        );
      case 'materias':
        return (
          <div className="tab-content">
            <h3>Materias Inscritas</h3>
            <p>Lista de materias inscritas.</p>
          </div>
        );
      case 'cum':
        return (
          <div className="tab-content">
            <h3>CUM (Coeficiente de Utilización de Materias)</h3>
            <p>Información del CUM.</p>
          </div>
        );
      case 'horario':
        return (
          <div className="tab-content">
            <h3>Horario Personal</h3>
            <p>Horario de clases del estudiante.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="students-container">
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'curso' ? 'active' : ''}`}
          onClick={() => setActiveTab('curso')}
        >
          📚 Curso
        </button>
        <button
          className={`tab-button ${activeTab === 'materias' ? 'active' : ''}`}
          onClick={() => setActiveTab('materias')}
        >
          📖 Materias
        </button>
        <button
          className={`tab-button ${activeTab === 'cum' ? 'active' : ''}`}
          onClick={() => setActiveTab('cum')}
        >
          📊 CUM
        </button>
        <button
          className={`tab-button ${activeTab === 'horario' ? 'active' : ''}`}
          onClick={() => setActiveTab('horario')}
        >
          📅 Horario
        </button>
        <button
          className="tab-button"
          onClick={() => setCurrentPage('maintenance')}
        >
          🔧 Mantenimiento
        </button>
      </div>
      <div className="students-layout">
        <aside className="profile-panel">
          <div className="profile-header">
            <div className="photo-section">
              <img src="/user-avatar.svg" alt="Foto del estudiante" className="profile-photo" />
              <button className="upload-button">Subir Foto</button>
            </div>
            <h3>Juan Pérez García</h3>
          </div>
          <div className="profile-details">
            <p><strong>Estado:</strong> Activo</p>
            <p><strong>Año de Inscripción:</strong> 2022</p>
            <p><strong>Último Ciclo:</strong> 2024-II</p>
          </div>
        </aside>
        <section className="students-content">
          {renderContent()}
        </section>
      </div>
    </div>
  );
};

export default Students;
