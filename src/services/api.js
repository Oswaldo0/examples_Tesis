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
};

export const coordinadoresApi = {
  getAll: () => request('/coordinadores'),
  getOne: (id) => request(`/coordinadores/${id}`),
};
