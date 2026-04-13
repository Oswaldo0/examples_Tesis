import React, { useState, useEffect } from 'react';
import '../styles/Maintenance.css';
import {
  facultadesApi,
  coordinadoresApi,
  planesEstudioApi,
  gruposApi,
  materiasApi,
  ciclosApi,
} from '../services/api';

const Maintenance = () => {
  const [activeSection, setActiveSection] = useState('facultades');
  const [facultades, setFacultades] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const [planesEstudio, setPlanesEstudio] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load data on mount and when activeSection changes
  useEffect(() => {
    loadSectionData();
  }, [activeSection]);

  const loadSectionData = async () => {
    setLoading(true);
    try {
      switch (activeSection) {
        case 'facultades':
          const facs = await facultadesApi.getAll().catch(() => []);
          setFacultades(Array.isArray(facs) ? facs : []);
          break;
        case 'coordinadores':
          const coords = await coordinadoresApi.getAll().catch(() => []);
          setCoordinadores(Array.isArray(coords) ? coords : []);
          break;
        case 'planes':
          const planes = await planesEstudioApi.getAll().catch(() => []);
          setPlanesEstudio(Array.isArray(planes) ? planes : []);
          break;
        case 'grupos':
          const grps = await gruposApi.getAll().catch(() => []);
          setGrupos(Array.isArray(grps) ? grps : []);
          break;
        case 'materias':
          const mats = await materiasApi.getAll().catch(() => []);
          const cycls = await ciclosApi.getAll().catch(() => []);
          setMaterias(Array.isArray(mats) ? mats : []);
          setCiclos(Array.isArray(cycls) ? cycls : []);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, apiMethod) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    try {
      await apiMethod(id);
      await loadSectionData();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const renderFacultadesSection = () => (
    <div className="section-container">
      <h2>Facultades</h2>
      <FacultadesTable
        data={facultades}
        onDelete={(id) => handleDelete(id, facultadesApi.remove)}
        onRefresh={loadSectionData}
      />
    </div>
  );

  const renderCoordinadoresSection = () => (
    <div className="section-container">
      <h2>Catedráticos (Coordinadores)</h2>
      <CoordinadoresTable
        data={coordinadores}
        facultades={facultades}
        onDelete={(id) => handleDelete(id, coordinadoresApi.remove)}
        onRefresh={ () => {
          loadSectionData();
          facultadesApi.getAll().then(f => setFacultades(f || [])).catch(() => {});
        }}
      />
    </div>
  );

  const renderPlanesSection = () => (
    <div className="section-container">
      <h2>Pensum (Planes de Estudio)</h2>
      <PlanesTable
        data={planesEstudio}
        onDelete={(id) => handleDelete(id, planesEstudioApi.remove)}
        onRefresh={loadSectionData}
      />
    </div>
  );

  const renderGruposSection = () => (
    <div className="section-container">
      <h2>Grupos</h2>
      <GruposTable
        data={grupos}
        onDelete={(id) => handleDelete(id, gruposApi.remove)}
        onRefresh={loadSectionData}
      />
    </div>
  );

  const renderMateriasSection = () => (
    <div className="section-container">
      <h2>Materias</h2>
      <MateriasTable
        data={materias}
        ciclos={ciclos}
        onDelete={(id) => handleDelete(id, materiasApi.remove)}
        onRefresh={loadSectionData}
      />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'facultades':
        return renderFacultadesSection();
      case 'coordinadores':
        return renderCoordinadoresSection();
      case 'planes':
        return renderPlanesSection();
      case 'grupos':
        return renderGruposSection();
      case 'materias':
        return renderMateriasSection();
      default:
        return null;
    }
  };

  return (
    <div className="maintenance-wrapper">
      <nav className="maintenance-layer">
        <h3>Opciones de Mantenimiento</h3>
        <ul>
          <li>
            <button
              className={`nav-btn ${activeSection === 'facultades' ? 'active' : ''}`}
              onClick={() => setActiveSection('facultades')}
            >
              Facultades
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'coordinadores' ? 'active' : ''}`}
              onClick={() => setActiveSection('coordinadores')}
            >
              Catedráticos
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'planes' ? 'active' : ''}`}
              onClick={() => setActiveSection('planes')}
            >
              Pensum
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'grupos' ? 'active' : ''}`}
              onClick={() => setActiveSection('grupos')}
            >
              Grupos
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeSection === 'materias' ? 'active' : ''}`}
              onClick={() => setActiveSection('materias')}
            >
              Materias
            </button>
          </li>
        </ul>
      </nav>
      <main className="maintenance-content">
        {loading ? <p>Cargando...</p> : renderSection()}
      </main>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// FACULTADES TABLE
// ────────────────────────────────────────────────────────────────────────
const FacultadesTable = ({ data, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    anio_de_creacion: new Date().getFullYear(),
    estado: 'ACTIVA',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre de la facultad es obligatorio');
      return;
    }
    try {
      await facultadesApi.create(formData);
      setFormData({ nombre: '', descripcion: '', anio_de_creacion: new Date().getFullYear(), estado: 'ACTIVA' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="table-section">
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        + Crear Facultad
      </button>

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de facultad"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Año de creación"
            value={formData.anio_de_creacion}
            onChange={(e) => setFormData({ ...formData, anio_de_creacion: parseInt(e.target.value) })}
          />
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <option value="ACTIVA">ACTIVA</option>
            <option value="INACTIVA">INACTIVA</option>
          </select>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Año de Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No hay facultades registradas
              </td>
            </tr>
          ) : (
            data.map((fac) => (
              <tr key={fac.id}>
                <td>{fac.id}</td>
                <td>{fac.nombre}</td>
                <td>{fac.descripcion || '-'}</td>
                <td>{fac.anio_de_creacion || '-'}</td>
                <td>{fac.estado}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(fac.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// COORDINADORES TABLE
// ────────────────────────────────────────────────────────────────────────
const CoordinadoresTable = ({ data, facultades, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id_catedratico: '',
    id_rol: '',
    id_facultad: '',
    anio_asignacion: new Date().getFullYear(),
    estado: 'ACTIVO',
    correo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_catedratico || !formData.correo) {
      alert('Los campos ID Catedratico y Correo son obligatorios');
      return;
    }
    try {
      await coordinadoresApi.create(formData);
      setFormData({
        id_catedratico: '',
        id_rol: '',
        id_facultad: '',
        anio_asignacion: new Date().getFullYear(),
        estado: 'ACTIVO',
        correo: '',
      });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="table-section">
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        + Crear Catedrático
      </button>

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="ID Catedrático"
            value={formData.id_catedratico}
            onChange={(e) => setFormData({ ...formData, id_catedratico: parseInt(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="ID Rol"
            value={formData.id_rol}
            onChange={(e) => setFormData({ ...formData, id_rol: e.target.value ? parseInt(e.target.value) : '' })}
          />
          <select
            value={formData.id_facultad}
            onChange={(e) => setFormData({ ...formData, id_facultad: e.target.value ? parseInt(e.target.value) : '' })}
          >
            <option value="">Seleccionar Facultad</option>
            {facultades.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Año de Asignación"
            value={formData.anio_asignacion}
            onChange={(e) => setFormData({ ...formData, anio_asignacion: parseInt(e.target.value) })}
          />
          <input
            type="email"
            placeholder="Correo"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            required
          />
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Catedrático</th>
            <th>ID Rol</th>
            <th>Facultad</th>
            <th>Año Asignación</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                No hay catedráticos registrados
              </td>
            </tr>
          ) : (
            data.map((coord) => (
              <tr key={coord.id}>
                <td>{coord.id}</td>
                <td>{coord.id_catedratico}</td>
                <td>{coord.id_rol || '-'}</td>
                <td>{coord.id_facultad || '-'}</td>
                <td>{coord.anio_asignacion}</td>
                <td>{coord.correo}</td>
                <td>{coord.estado}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(coord.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// PLANES DE ESTUDIO TABLE
// ────────────────────────────────────────────────────────────────────────
const PlanesTable = ({ data, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre del pensum es obligatorio');
      return;
    }
    try {
      await planesEstudioApi.create(formData);
      setFormData({ nombre: '', descripcion: '' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="table-section">
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        + Crear Plan de Estudio
      </button>

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del Plan de Estudio"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th style={{ display: 'none' }}>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No hay planes de estudio registrados
              </td>
            </tr>
          ) : (
            data.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{plan.nombre}</td>
                <td style={{ display: 'none' }}>{plan.descripcion || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(plan.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// GRUPOS TABLE
// ────────────────────────────────────────────────────────────────────────
const GruposTable = ({ data, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre del grupo es obligatorio');
      return;
    }
    try {
      await gruposApi.create(formData);
      setFormData({ nombre: '', descripcion: '' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="table-section">
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        + Crear Grupo
      </button>

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del Grupo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th style={{ display: 'none' }}>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No hay grupos registrados
              </td>
            </tr>
          ) : (
            data.map((grupo) => (
              <tr key={grupo.id}>
                <td>{grupo.id}</td>
                <td>{grupo.nombre}</td>
                <td style={{ display: 'none' }}>{grupo.descripcion || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(grupo.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// MATERIAS TABLE
// ────────────────────────────────────────────────────────────────────────
const MateriasTable = ({ data, ciclos, onDelete, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    id_ciclo: '',
    estado: 'ACTIVA',
    descripcion: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre de la materia es obligatorio');
      return;
    }
    try {
      await materiasApi.create(formData);
      setFormData({ nombre: '', id_ciclo: '', estado: 'ACTIVA', descripcion: '' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="table-section">
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        + Crear Materia
      </button>

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la Materia"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <select
            value={formData.id_ciclo}
            onChange={(e) => setFormData({ ...formData, id_ciclo: e.target.value ? parseInt(e.target.value) : '' })}
          >
            <option value="">Seleccionar Ciclo</option>
            {ciclos.map((ciclo) => (
              <option key={ciclo.id} value={ciclo.id}>
                {ciclo.nombre || `Ciclo ${ciclo.id}`}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          >
            <option value="ACTIVA">ACTIVA</option>
            <option value="INACTIVA">INACTIVA</option>
          </select>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ciclo</th>
            <th>Estado</th>
            <th style={{ display: 'none' }}>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No hay materias registradas
              </td>
            </tr>
          ) : (
            data.map((materia) => (
              <tr key={materia.id}>
                <td>{materia.id}</td>
                <td>{materia.nombre}</td>
                <td>{materia.id_ciclo || '-'}</td>
                <td>{materia.estado}</td>
                <td style={{ display: 'none' }}>{materia.descripcion || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(materia.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Maintenance;
