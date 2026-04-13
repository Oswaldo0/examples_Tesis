import React, { useState, useEffect } from 'react';
import { usuariosApi } from '../services/api';

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'usuario',
    estado: 'activo',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosApi.getAll().catch(() => []);
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert('Nombre y Email son obligatorios');
      return;
    }
    try {
      if (editingId) {
        await usuariosApi.update(editingId, formData);
      } else {
        await usuariosApi.create(formData);
      }
      resetForm();
      await loadUsuarios();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol || 'usuario',
      estado: usuario.estado || 'activo',
    });
    setEditingId(usuario.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await usuariosApi.remove(id);
      await loadUsuarios();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      rol: 'usuario',
      estado: 'activo',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-600 mt-1">Administra los usuarios del sistema</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* BUTTON CREATE */}
        <div className="mb-8">
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-xl">✚</span>
            {showForm ? 'Cancelar' : 'Crear Usuario'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Rol */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="catedratico">Catedrático</option>
                    <option value="coordinador">Coordinador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Estado */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-slate-300 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Lista de Usuarios ({usuarios.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-600">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-slate-600 font-medium">No hay usuarios registrados</p>
              <p className="text-slate-500 text-sm mt-2">Crea el primer usuario haciendo clic en "Crear Usuario"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario, idx) => (
                    <tr
                      key={usuario.id}
                      className={`border-b border-slate-100 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{usuario.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{usuario.nombre}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{usuario.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.rol === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : usuario.rol === 'coordinador'
                              ? 'bg-purple-100 text-purple-800'
                              : usuario.rol === 'catedratico'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {usuario.rol || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                            usuario.estado === 'activo' || usuario.estado === 'ACTIVO'
                              ? 'bg-green-100 text-green-800'
                              : usuario.estado === 'inactivo' || usuario.estado === 'INACTIVO'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {usuario.estado || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(usuario)}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold"
                          >
                            ✎ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(usuario.id)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold"
                          >
                            ✕ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
