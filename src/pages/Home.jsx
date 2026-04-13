import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { materiasApi, facultadesApi, carrerasApi, ciclosApi } from '../services/api';

const Home = () => {
  const [activeTab, setActiveTab] = useState('horario');
  const [filters, setFilters] = useState({
    group: 'Grupo A',
    student: '',
    year: '1er Año',
    career: '',
    pensum: '2024',
    faculty: '',
    dia: 'Lunes',
  });

  const [materias, setMaterias] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    setLoadingFilters(true);
    Promise.all([facultadesApi.getAll(), carrerasApi.getAll(), ciclosApi.getAll()])
      .then(([facs, cars, cics]) => {
        setFacultades(facs);
        setCarreras(cars);
        setCiclos(cics);
        if (facs.length > 0) setFilters((f) => ({ ...f, faculty: String(facs[0].id) }));
        if (cars.length > 0) setFilters((f) => ({ ...f, career: String(cars[0].id) }));
      })
      .catch(console.error)
      .finally(() => setLoadingFilters(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'materias') {
      setLoadingMaterias(true);
      materiasApi.getAll()
        .then(setMaterias)
        .catch(console.error)
        .finally(() => setLoadingMaterias(false));
    }
  }, [activeTab]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'horario':
        return (
          <div className="horario-layout">
            <aside className="filter-panel">
              <h3>Filtros</h3>
              <div className="filter-group">
                <label>Grupo</label>
                <select
                  value={filters.group}
                  onChange={(e) => handleFilterChange('group', e.target.value)}
                >
                  <option>Grupo A</option>
                  <option>Grupo B</option>
                  <option>Grupo C</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Estudiante</label>
                <input
                  type="text"
                  placeholder="Buscar estudiante"
                  value={filters.student}
                  onChange={(e) => handleFilterChange('student', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Año de carrera</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option>1er Año</option>
                  <option>2do Año</option>
                  <option>3er Año</option>
                  <option>4to Año</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Carrera</label>
                <select value={filters.career} onChange={(e) => handleFilterChange('career', e.target.value)}>
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : carreras.length === 0
                    ? <option value="">Sin carreras</option>
                    : carreras.map((c) => <option key={c.id} value={String(c.id)}>{c.nombre}</option>)
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Pensum</label>
                <select
                  value={filters.pensum}
                  onChange={(e) => handleFilterChange('pensum', e.target.value)}
                >
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div>
              <button className="filter-button" type="button">
                Aplicar filtros
              </button>
            </aside>
            <section className="schedule-content tab-content">
              <h3>Horario de Clases</h3>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>08:00 - 09:00</td>
                    <td>Matemática</td>
                    <td>Inglés</td>
                    <td>Matemática</td>
                    <td>Física</td>
                    <td>Inglés</td>
                  </tr>
                  <tr>
                    <td>09:00 - 10:00</td>
                    <td>Física</td>
                    <td>Química</td>
                    <td>Historia</td>
                    <td>Matemática</td>
                    <td>Química</td>
                  </tr>
                  <tr>
                    <td>10:00 - 11:00</td>
                    <td colSpan="5" className="break">Descanso</td>
                  </tr>
                  <tr>
                    <td>11:00 - 12:00</td>
                    <td>Historia</td>
                    <td>Matemática</td>
                    <td>Inglés</td>
                    <td>Química</td>
                    <td>Historia</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        );
      case 'grupos':
        return (
          <div className="tab-content">
            <h3>Grupos</h3>
            <div className="groups-list">
              <div className="group-card">
                <h4>Grupo A - Sección 1</h4>
                <p><strong>Aula:</strong> 101</p>
                <p><strong>Cantidad de estudiantes:</strong> 35</p>
                <p><strong>Jefe de grupo:</strong> Juan Pérez</p>
              </div>
              <div className="group-card">
                <h4>Grupo B - Sección 2</h4>
                <p><strong>Aula:</strong> 102</p>
                <p><strong>Cantidad de estudiantes:</strong> 32</p>
                <p><strong>Jefe de grupo:</strong> María García</p>
              </div>
              <div className="group-card">
                <h4>Grupo C - Sección 3</h4>
                <p><strong>Aula:</strong> 103</p>
                <p><strong>Cantidad de estudiantes:</strong> 38</p>
                <p><strong>Jefe de grupo:</strong> Carlos López</p>
              </div>
            </div>
          </div>
        );
      case 'materias':
        return (
          <div className="horario-layout">
            <aside className="filter-panel">
              <h3>Filtros</h3>
              <div className="filter-group">
                <label>Facultad</label>
                <select value={filters.faculty} onChange={(e) => handleFilterChange('faculty', e.target.value)}>
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : facultades.length === 0
                    ? <option value="">Sin facultades</option>
                    : facultades.map((f) => <option key={f.id} value={String(f.id)}>{f.nombre}</option>)
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Año</label>
                <select value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
                  <option>1er Año</option>
                  <option>2do Año</option>
                  <option>3er Año</option>
                  <option>4to Año</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Ciclo</label>
                <select onChange={(e) => handleFilterChange('ciclo', e.target.value)}>
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : ciclos.length === 0
                    ? <option value="">Sin ciclos</option>
                    : ciclos.map((c) => <option key={c.id} value={String(c.id)}>{c.ciclo} - {c.anio}</option>)
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Día</label>
                <select
                  value={filters.dia}
                  onChange={(e) => handleFilterChange('dia', e.target.value)}
                >
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                </select>
              </div>
              <button className="filter-button" type="button">
                Aplicar filtros
              </button>
            </aside>
            <section className="schedule-content tab-content">
              <h3>Materias</h3>
              <h3>Materias {loadingMaterias ? '(cargando…)' : `(${materias.length})`}</h3>
              {loadingMaterias ? (
                <p>Cargando materias…</p>
              ) : materias.length === 0 ? (
                <p>No hay materias registradas en la base de datos.</p>
              ) : (
                <div className="subjects-list">
                  {materias.map((m) => (
                    <div key={m.id} className="subject-card">
                      <h4>📖 {m.nombre}</h4>
                      <p><strong>Estado:</strong> {m.estado}</p>
                      {m.descripcion && <p>{m.descripcion}</p>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        );
      case 'calendario':
        return (
          <div className="tab-content">
            <h3>Calendario Académico</h3>
            <div className="calendar-list">
              <div className="calendar-event">
                <span className="event-date">15 de Abril</span>
                <span className="event-title">Inicio de Semestre</span>
              </div>
              <div className="calendar-event">
                <span className="event-date">20 de Mayo</span>
                <span className="event-title">Primer Parcial</span>
              </div>
              <div className="calendar-event">
                <span className="event-date">25 de Junio</span>
                <span className="event-title">Segundo Parcial</span>
              </div>
              <div className="calendar-event">
                <span className="event-date">30 de Junio</span>
                <span className="event-title">Último día de clases</span>
              </div>
              <div className="calendar-event">
                <span className="event-date">15 de Julio</span>
                <span className="event-title">Examen Final</span>
              </div>
              <div className="calendar-event">
                <span className="event-date">31 de Julio</span>
                <span className="event-title">Publicación de notas finales</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'horario' ? 'active' : ''}`}
          onClick={() => setActiveTab('horario')}
        >
          📅 Horario de Clases
        </button>
        <button 
          className={`tab-button ${activeTab === 'grupos' ? 'active' : ''}`}
          onClick={() => setActiveTab('grupos')}
        >
          👥 Grupos
        </button>
        <button 
          className={`tab-button ${activeTab === 'materias' ? 'active' : ''}`}
          onClick={() => setActiveTab('materias')}
        >
          📚 Materias
        </button>
        <button 
          className={`tab-button ${activeTab === 'calendario' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendario')}
        >
          🗓️ Calendario
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Home;