import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import {
  materiasApi,
  facultadesApi,
  carrerasApi,
  ciclosApi,
  gruposApi,
  planesEstudioApi,
  studentsApi,
} from '../services/api';

const getCatalogLabel = (item, fallback = 'Sin nombre') => {
  if (!item || typeof item !== 'object') return fallback;
  return (
    item.nombre ||
    item.grupo ||
    item.descripcion ||
    item.codigo ||
    (item.ciclo && item.anio ? `${item.ciclo} ${item.anio}` : null) ||
    item.id ||
    fallback
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('horario');
  const [filters, setFilters] = useState({
    group: '',
    student: '',
    year: '',
    career: '',
    pensum: '',
    faculty: '',
    ciclo: '',
    dia: 'Lunes',
  });

  const [students, setStudents] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [planesEstudio, setPlanesEstudio] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    setLoadingFilters(true);
    const safe = (promise) => promise.catch(() => []);
    Promise.all([
      safe(facultadesApi.getAll()),
      safe(carrerasApi.getAll()),
      safe(ciclosApi.getAll()),
      safe(gruposApi.getAll()),
      safe(planesEstudioApi.getAll()),
      safe(studentsApi.getAll()),
    ])
      .then(([facs, cars, cics, grps, planes, sts]) => {
        setFacultades(facs);
        setCarreras(cars);
        setCiclos(cics);
        setGrupos(grps);
        setPlanesEstudio(planes);
        setStudents(sts);

        setFilters((prev) => ({
          ...prev,
          faculty: facs.length > 0 ? String(facs[0].id) : prev.faculty,
          career: cars.length > 0 ? String(cars[0].id) : prev.career,
          ciclo: cics.length > 0 ? String(cics[0].id) : prev.ciclo,
          group: grps.length > 0 ? String(grps[0].id) : prev.group,
          pensum: planes.length > 0 ? String(planes[0].id) : prev.pensum,
          student: sts.length > 0 ? String(sts[0].expediente) : prev.student,
          year:
            cics.length > 0 && cics[0].anio !== undefined && cics[0].anio !== null
              ? String(cics[0].anio)
              : prev.year,
        }));
      })
      .catch(console.error)
      .finally(() => setLoadingFilters(false));
  }, []);

  const yearOptions = Array.from(
    new Set(
      ciclos
        .map((c) => c?.anio)
        .filter((anio) => anio !== undefined && anio !== null && String(anio).trim() !== ''),
    ),
  )
    .map((anio) => String(anio))
    .sort((a, b) => Number(b) - Number(a));

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
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : grupos.length === 0
                    ? <option value="">Sin grupos</option>
                    : grupos.map((g) => (
                        <option key={g.id} value={String(g.id)}>{getCatalogLabel(g, `Grupo ${g.id}`)}</option>
                      ))
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Código de estudiante</label>
                <select
                  value={filters.student}
                  onChange={(e) => handleFilterChange('student', e.target.value)}
                >
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : students.length === 0
                    ? <option value="">Sin estudiantes</option>
                    : students.map((s) => (
                        <option key={s.expediente} value={String(s.expediente)}>
                          {String(s.expediente)}
                        </option>
                      ))
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Año de carrera</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : yearOptions.length === 0
                    ? <option value="">Sin años</option>
                    : yearOptions.map((anio) => <option key={anio} value={anio}>{anio}</option>)
                  }
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
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : planesEstudio.length === 0
                    ? <option value="">Sin pensum</option>
                    : planesEstudio.map((p) => (
                        <option key={p.id} value={String(p.id)}>{getCatalogLabel(p, `Pensum ${p.id}`)}</option>
                      ))
                  }
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
                  {loadingFilters
                    ? <option>Cargando…</option>
                    : yearOptions.length === 0
                    ? <option value="">Sin años</option>
                    : yearOptions.map((anio) => <option key={anio} value={anio}>{anio}</option>)
                  }
                </select>
              </div>
              <div className="filter-group">
                <label>Ciclo</label>
                <select value={filters.ciclo} onChange={(e) => handleFilterChange('ciclo', e.target.value)}>
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