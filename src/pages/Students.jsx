import React, { useState, useEffect, useCallback } from "react";
import "../styles/Students.css";
import userAvatar from "../assets/user-avatar.svg";
import {
  studentsApi,
  carrerasApi,
  ciclosApi,
  direccionesApi,
  responsablesApi,
  gruposApi,
  planesEstudioApi,
} from "../services/api";

// ── Campos del formulario basados en la entidad Student ──────────────────────
const EMPTY_FORM = {
  expediente: "",
  nombres: "",
  apellidos: "",
  cum: "",
  num_carnet: "",
  calidad: "",
  id_direccion: "",
  telefono: "",
  correo: "",
  id_carrera: "",
  edad: "",
  fecha_nac: "",
  id_responsable: "",
  estado_academico: "",
  institucion_proc: "",
  anio_ingreso: "",
  id_ciclo: "",
  id_grupo: "",
  id_plan_estu: "",
  empleo: "",
};

const FIELD_LABELS = {
  expediente: "Expediente *",
  nombres: "Nombres *",
  apellidos: "Apellidos *",
  cum: "CUM",
  num_carnet: "N° de Carnet",
  calidad: "Calidad",
  id_direccion: "ID Dirección",
  telefono: "Teléfono",
  correo: "Correo electrónico",
  id_carrera: "Carrera",
  edad: "Edad",
  fecha_nac: "Fecha de nacimiento",
  id_responsable: "ID Responsable",
  estado_academico: "Estado académico",
  institucion_proc: "Institución procedencia",
  anio_ingreso: "Año de ingreso",
  id_ciclo: "Ciclo",
  id_grupo: "ID Grupo",
  id_plan_estu: "ID Plan de estudio",
  empleo: "Empleo",
};

const ESTADO_OPTIONS = [
  "Activo",
  "Inactivo",
  "Graduado",
  "Retirado",
  "Suspendido",
];
const CALIDAD_OPTIONS = ["Regular", "Irregular", "Egresado"];

/**
 * Genera una etiqueta de texto para un registro de catálogo.
 * Intenta campos comunes; si no, concatena todos los valores no-id.
 */
const labelFor = (row) => {
  if (!row) return "";
  // Intentar campos de nombre comunes
  const nameFields = [
    "nombre",
    "nombres",
    "descripcion",
    "departamento",
    "municipio",
    "dir_exacta",
    "direccion",
    "ciclo",
    "anio",
  ];
  const parts = nameFields.map((f) => row[f]).filter(Boolean);
  if (parts.length) return parts.join(" — ");
  // Fallback: todos los valores excepto `id`
  return Object.entries(row)
    .filter(([k]) => k !== "id")
    .map(([, v]) => v)
    .filter(Boolean)
    .join(" – ");
};

// ── Modal de formulario (Agregar / Actualizar) ───────────────────────────────
const StudentFormModal = ({
  mode,
  initialData,
  carreras,
  ciclos,
  direcciones,
  responsables,
  grupos,
  planesEstudio,
  onSave,
  onClose,
}) => {
  const [form, setForm] = useState(
    mode === "edit" ? { ...EMPTY_FORM, ...initialData } : { ...EMPTY_FORM },
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.expediente || !form.nombres || !form.apellidos) {
      setFormError("Expediente, nombres y apellidos son obligatorios.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      // limpiar campos vacíos → null para no enviar strings vacíos
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === "" ? null : v]),
      );
      await onSave(payload);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "edit"
              ? "✏️ Actualizar Estudiante"
              : "➕ Agregar Estudiante"}
          </h2>
          <button
            className="text-2xl leading-none text-slate-600 hover:text-slate-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {formError && (
          <p className="m-6 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {formError}
          </p>
        )}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expediente */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.expediente}
              </label>
              <input
                name="expediente"
                value={form.expediente}
                onChange={handleChange}
                disabled={mode === "edit"}
                placeholder="Ej: 2021-001"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
            {/* Nombres */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.nombres}
              </label>
              <input
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                placeholder="Nombres completos"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Apellidos */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.apellidos}
              </label>
              <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Apellidos completos"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* CUM */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.cum}
              </label>
              <input
                name="cum"
                type="number"
                step="0.01"
                value={form.cum}
                onChange={handleChange}
                placeholder="Ej: 7.50"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* N° Carnet */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.num_carnet}
              </label>
              <input
                name="num_carnet"
                value={form.num_carnet}
                onChange={handleChange}
                placeholder="Número de carnet"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Calidad */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.calidad}
              </label>
              <select
                name="calidad"
                value={form.calidad}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {CALIDAD_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            {/* Teléfono */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.telefono}
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 5555-1234"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Correo */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.correo}
              </label>
              <input
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Carrera */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.id_carrera}
              </label>
              <select
                name="id_carrera"
                value={form.id_carrera}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {carreras.map((c) => (
                  <option
                    key={c.id_carrera ?? c.id}
                    value={c.id_carrera ?? c.id}
                  >
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            {/* Edad */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.edad}
              </label>
              <input
                name="edad"
                type="number"
                value={form.edad}
                onChange={handleChange}
                placeholder="Edad"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Fecha nac */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.fecha_nac}
              </label>
              <input
                name="fecha_nac"
                type="date"
                value={form.fecha_nac ? form.fecha_nac.split("T")[0] : ""}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Estado académico */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.estado_academico}
              </label>
              <select
                name="estado_academico"
                value={form.estado_academico}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {ESTADO_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            {/* Institución procedencia */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.institucion_proc}
              </label>
              <input
                name="institucion_proc"
                value={form.institucion_proc}
                onChange={handleChange}
                placeholder="Institución de procedencia"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Año ingreso */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.anio_ingreso}
              </label>
              <input
                name="anio_ingreso"
                type="number"
                value={form.anio_ingreso}
                onChange={handleChange}
                placeholder="Ej: 2021"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Ciclo */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                Ciclo académico
              </label>
              <select
                name="id_ciclo"
                value={form.id_ciclo}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {ciclos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {labelFor(c)}
                  </option>
                ))}
              </select>
            </div>
            {/* Grupo */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                Grupo
              </label>
              <select
                name="id_grupo"
                value={form.id_grupo}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {labelFor(g)}
                  </option>
                ))}
              </select>
            </div>
            {/* Plan de estudio */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                Plan de estudio
              </label>
              <select
                name="id_plan_estu"
                value={form.id_plan_estu}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {planesEstudio.map((p) => (
                  <option key={p.id} value={p.id}>
                    {labelFor(p)}
                  </option>
                ))}
              </select>
            </div>
            {/* Dirección */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                Dirección
              </label>
              <select
                name="id_direccion"
                value={form.id_direccion}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {direcciones.map((d) => (
                  <option key={d.id} value={d.id}>
                    {labelFor(d)}
                  </option>
                ))}
              </select>
            </div>
            {/* Responsable */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                Responsable
              </label>
              <select
                name="id_responsable"
                value={form.id_responsable}
                onChange={handleChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Seleccionar --</option>
                {responsables.map((r) => (
                  <option key={r.id} value={r.id}>
                    {labelFor(r)}
                  </option>
                ))}
              </select>
            </div>
            {/* Empleo */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700 mb-2">
                {FIELD_LABELS.empleo}
              </label>
              <input
                name="empleo"
                value={form.empleo}
                onChange={handleChange}
                placeholder="Lugar de empleo"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-slate-300 transition-all duration-300"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={saving}
            >
              {saving
                ? "Guardando…"
                : mode === "edit"
                  ? "Actualizar"
                  : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Modal de confirmación de eliminación ─────────────────────────────────────
const DeleteConfirmModal = ({ students, onConfirm, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const [delError, setDelError] = useState(null);

  const handleConfirm = async () => {
    setDeleting(true);
    setDelError(null);
    try {
      await onConfirm();
    } catch (err) {
      setDelError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            🗑️ Eliminar Estudiante{students.length > 1 ? "s" : ""}
          </h2>
          <button
            className="text-2xl leading-none text-slate-600 hover:text-slate-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <p className="mb-4 text-slate-700">
            ¿Estás seguro que deseas eliminar
            {students.length > 1
              ? " los siguientes estudiantes"
              : " al siguiente estudiante"}
            ? Esta acción no se puede deshacer.
          </p>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {students.map((s) => (
              <div
                key={s.expediente}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <strong className="text-slate-900">
                      {s.nombres} {s.apellidos}
                    </strong>
                    <span className="text-slate-600 text-sm block">
                      {" "}
                      — Exp: {s.expediente}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {delError && (
            <p className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              {delError}
            </p>
          )}
          <div className="flex gap-4">
            <button
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-slate-300 transition-all duration-300"
              onClick={onClose}
              disabled={deleting}
            >
              Cancelar
            </button>
            <button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={handleConfirm}
              disabled={deleting}
            >
              {deleting ? "Eliminando…" : "Confirmar eliminación"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Componente principal ─────────────────────────────────────────────────────
const Students = () => {
  const [students, setStudents] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [planesEstudio, setPlanesEstudio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Selección por checkbox
  const [checkedIds, setCheckedIds] = useState(new Set());
  // Estudiante que se muestra en el panel de detalle
  const [viewStudent, setViewStudent] = useState(null);

  // Modales
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'delete'

  const fetchStudents = useCallback(async () => {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    // Los catálogos se envuelven en catch(() => []) para que un 404 o error
    // de tabla inexistente no rompa la carga de la lista de estudiantes.
    const safe = (promise) => promise.catch(() => []);
    Promise.all([
      studentsApi.getAll(),
      safe(carrerasApi.getAll()),
      safe(ciclosApi.getAll()),
      safe(direccionesApi.getAll()),
      safe(responsablesApi.getAll()),
      safe(gruposApi.getAll()),
      safe(planesEstudioApi.getAll()),
    ])
      .then(([sts, cars, cics, dirs, resps, grps, planes]) => {
        setStudents(sts);
        setCarreras(cars);
        setCiclos(cics);
        setDirecciones(dirs);
        setResponsables(resps);
        setGrupos(grps);
        setPlanesEstudio(planes);
        if (sts.length > 0) setViewStudent(sts[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ── Selección ──
  const toggleCheck = (expediente) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(expediente) ? next.delete(expediente) : next.add(expediente);
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedIds.size === students.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(students.map((s) => s.expediente)));
    }
  };

  const checkedStudents = students.filter((s) => checkedIds.has(s.expediente));

  // ── CRUD handlers ──
  const handleAdd = async (payload) => {
    await studentsApi.create(payload);
    await fetchStudents();
    setModal(null);
    showSuccess(
      `Estudiante "${payload.nombres} ${payload.apellidos}" agregado correctamente.`,
    );
  };

  const handleEdit = async (payload) => {
    await studentsApi.update(payload.expediente, payload);
    await fetchStudents();
    setModal(null);
    setViewStudent(payload);
    showSuccess(`Estudiante actualizado correctamente.`);
  };

  const handleDelete = async () => {
    for (const s of checkedStudents) {
      await studentsApi.remove(s.expediente);
    }
    setCheckedIds(new Set());
    setViewStudent(null);
    await fetchStudents();
    setModal(null);
    showSuccess(`${checkedStudents.length} estudiante(s) eliminado(s).`);
  };

  // ── Render ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              👩‍🎓 Gestión de Estudiantes
            </h1>
            <p className="text-slate-600 mt-1">
              Administra el registro de estudiantes
            </p>
          </div>
          <button
            type="button"
            disabled
            title="Mantenimiento deshabilitado temporalmente"
            className="px-4 py-2 bg-slate-200 text-slate-500 font-semibold rounded-lg cursor-not-allowed"
          >
            🔧 Mantenimiento
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
        {successMsg && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg">
            Error: {error}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex gap-8">
          {/* TABLA */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Lista de Estudiantes ({students.length})
                </h2>
                <button
                  onClick={() => setModal("add")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span className="text-lg">➕</span> Agregar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-slate-600">Cargando estudiantes...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-slate-600 font-medium">
                  No hay estudiantes registrados
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-12">
                        <input
                          type="checkbox"
                          checked={
                            students.length > 0 &&
                            checkedIds.size === students.length
                          }
                          onChange={toggleAll}
                          title="Seleccionar todos"
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Expediente
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Nombres
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Apellidos
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Año Ingreso
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        CUM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.expediente}
                        className={`border-b border-slate-100 transition-colors cursor-pointer ${
                          checkedIds.has(s.expediente)
                            ? "bg-blue-50"
                            : "bg-white"
                        } ${viewStudent?.expediente === s.expediente ? "bg-blue-100" : ""} hover:bg-blue-50`}
                        onClick={() => setViewStudent(s)}
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={checkedIds.has(s.expediente)}
                            onChange={() => toggleCheck(s.expediente)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                          {s.expediente}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {s.nombres}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {s.apellidos}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                              s.estado_academico === "Activo"
                                ? "bg-green-100 text-green-800"
                                : s.estado_academico === "Inactivo"
                                  ? "bg-slate-100 text-slate-800"
                                  : s.estado_academico === "Graduado"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {s.estado_academico ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {s.anio_ingreso ?? "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {s.cum ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* BOTONES DE ACCIÓN */}
            {checkedStudents.length > 0 && (
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setModal("edit")}
                  disabled={checkedStudents.length !== 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  ✎ Editar
                </button>
                <button
                  onClick={() => setModal("delete")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  ✕ Eliminar ({checkedStudents.length})
                </button>
              </div>
            )}
          </div>

          {/* PANEL DE DETALLE */}
          {viewStudent && (
            <aside className="w-80 bg-white rounded-lg shadow-md border border-slate-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="text-center mb-6 pb-6 border-b border-slate-200">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100"
                />
                <h3 className="text-lg font-bold text-slate-900">
                  {viewStudent.nombres} {viewStudent.apellidos}
                </h3>
                <p className="text-slate-600 text-sm">
                  Exp: <strong>{viewStudent.expediente}</strong>
                </p>
              </div>

              <div className="space-y-4">
                {[
                  ["CUM", viewStudent.cum],
                  ["N° Carnet", viewStudent.num_carnet],
                  ["Calidad", viewStudent.calidad],
                  ["Estado", viewStudent.estado_academico],
                  [
                    "Carrera",
                    carreras.find((c) => c.id == viewStudent.id_carrera)
                      ?.nombre || viewStudent.id_carrera,
                  ],
                  [
                    "Ciclo",
                    labelFor(
                      ciclos.find((c) => c.id == viewStudent.id_ciclo),
                    ) || viewStudent.id_ciclo,
                  ],
                  ["Año ingreso", viewStudent.anio_ingreso],
                  ["Edad", viewStudent.edad],
                  [
                    "Fecha nac.",
                    viewStudent.fecha_nac
                      ? viewStudent.fecha_nac.split("T")[0]
                      : null,
                  ],
                  ["Teléfono", viewStudent.telefono],
                  ["Correo", viewStudent.correo],
                  ["Empleo", viewStudent.empleo],
                  ["Inst. Proc.", viewStudent.institucion_proc],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-sm font-semibold text-slate-700">
                      {label}
                    </div>
                    <div className="text-sm text-slate-600">{value || "—"}</div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Modales */}
      {modal === "add" && (
        <StudentFormModal
          mode="add"
          carreras={carreras}
          ciclos={ciclos}
          direcciones={direcciones}
          responsables={responsables}
          grupos={grupos}
          planesEstudio={planesEstudio}
          onSave={handleAdd}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && checkedStudents.length === 1 && (
        <StudentFormModal
          mode="edit"
          initialData={checkedStudents[0]}
          carreras={carreras}
          ciclos={ciclos}
          direcciones={direcciones}
          responsables={responsables}
          grupos={grupos}
          planesEstudio={planesEstudio}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && checkedStudents.length > 0 && (
        <DeleteConfirmModal
          students={checkedStudents}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Students;
