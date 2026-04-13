import '../styles/MaintenanceBlank.css';

const options = [
  'Agregar facultades',
  'Agregar materias',
  'Agregar pensum',
  'Historia de pensum',
  'Catedraticos'
];

const MaintenanceBlank = () => {
  return (
    <div className="maintenance-blank-container">
      <div className="maintenance-target-card">
        <h2>Mantenimiento</h2>
        <p>Selecciona una opcion:</p>
        <div className="maintenance-target-options">
          {options.map((option) => (
            <button key={option} type="button" className="maintenance-target-option">
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBlank;