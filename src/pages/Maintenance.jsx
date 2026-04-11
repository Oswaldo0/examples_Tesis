import React from 'react';
import '../styles/Maintenance.css';

const Maintenance = ({ setCurrentPage }) => {
  const handleAdd = () => {
    alert('Funcionalidad para agregar registro');
  };

  const handleUpdate = () => {
    alert('Funcionalidad para actualizar información');
  };

  const handleDelete = () => {
    alert('Funcionalidad para eliminar registro');
  };

  return (
    <div className="maintenance-container">
      <h2>Página de Mantenimiento</h2>
      <p>Gestión de registros del sistema.</p>
      <div className="maintenance-buttons">
        <button className="maintenance-button add" onClick={handleAdd}>
          ➕ Agregar
        </button>
        <button className="maintenance-button update" onClick={handleUpdate}>
          ✏️ Actualizar Información
        </button>
        <button className="maintenance-button delete" onClick={handleDelete}>
          🗑️ Eliminar Registro
        </button>
        <button className="maintenance-button reactivate" onClick={() => setCurrentPage('requests')}>
          🔄 Reactivar
        </button>
      </div>
    </div>
  );
};

export default Maintenance;