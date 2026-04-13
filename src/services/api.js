const BASE_URL = '/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const studentsApi = {
  getAll: () => request('/students'),
  getOne: (expediente) => request(`/students/${expediente}`),
  create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (expediente, data) =>
    request(`/students/${expediente}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (expediente) =>
    request(`/students/${expediente}`, { method: 'DELETE' }),
};

export const facultadesApi = {
  getAll: () => request('/facultades'),
  getOne: (id) => request(`/facultades/${id}`),
  create: (data) => request('/facultades', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/facultades/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/facultades/${id}`, { method: 'DELETE' }),
};

export const ciclosApi = {
  getAll: () => request('/ciclos'),
};

export const carrerasApi = {
  getAll: () => request('/carreras'),
  getOne: (id) => request(`/carreras/${id}`),
};

export const materiasApi = {
  getAll: () => request('/materias'),
  getOne: (id) => request(`/materias/${id}`),
  create: (data) => request('/materias', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/materias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/materias/${id}`, { method: 'DELETE' }),
};

export const coordinadoresApi = {
  getAll: () => request('/coordinadores'),
  getOne: (id) => request(`/coordinadores/${id}`),
  create: (data) => request('/coordinadores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/coordinadores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/coordinadores/${id}`, { method: 'DELETE' }),
};

export const usuariosApi = {
  getAll: () => request('/usuarios'),
  getOne: (id) => request(`/usuarios/${id}`),
  create: (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
};

// Catálogos FK del estudiante
export const direccionesApi  = {
  getAll: () => request('/direcciones'),
  create: (data) => request('/direcciones', { method: 'POST', body: JSON.stringify(data) }),
};

export const responsablesApi = {
  getAll: () => request('/responsables'),
  create: (data) => request('/responsables', { method: 'POST', body: JSON.stringify(data) }),
};

export const gruposApi       = {
  getAll: () => request('/grupos'),
  create: (data) => request('/grupos', { method: 'POST', body: JSON.stringify(data) }),
};

export const planesEstudioApi = {
  getAll: () => request('/planes-estudio'),
  create: (data) => request('/planes-estudio', { method: 'POST', body: JSON.stringify(data) }),
};
