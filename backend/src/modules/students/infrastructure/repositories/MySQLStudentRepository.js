import { pool } from '../../../../config/database.js';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { Student } from '../../domain/entities/Student.js';

const UPDATABLE_FIELDS = [
  'nombres', 'apellidos', 'cum', 'num_carnet', 'calidad', 'id_direccion',
  'telefono', 'correo', 'id_carrera', 'edad', 'fecha_nac', 'id_responsable',
  'estado_academico', 'institucion_proc', 'anio_ingreso', 'id_ciclo',
  'id_grupo', 'id_plan_estu', 'empleo',
];

// Campos que son FK enteras: cadena vacía o 0 deben ser NULL
const FK_INT_FIELDS = new Set([
  'id_direccion', 'id_carrera', 'id_responsable',
  'id_ciclo', 'id_grupo', 'id_plan_estu',
]);

// Campos numéricos no FK: cadena vacía → NULL
const NUMERIC_FIELDS = new Set(['cum', 'edad', 'anio_ingreso', 'num_carnet']);

/**
 * Convierte valores vacíos/inválidos a null para campos FK e int
 * antes de enviarse a MySQL.
 */
function sanitize(value, field) {
  if (FK_INT_FIELDS.has(field) || NUMERIC_FIELDS.has(field)) {
    if (value === '' || value === undefined || value === null) return null;
    const parsed = Number(value);
    // Si el campo es FK y el valor no es un entero positivo válido → null
    if (FK_INT_FIELDS.has(field) && (!Number.isInteger(parsed) || parsed <= 0)) return null;
    return parsed;
  }
  // Cualquier otro campo: convertir '' → null
  if (value === '' || value === undefined) return null;
  return value;
}

export class MySQLStudentRepository extends IStudentRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM estudiante');
    return rows.map((r) => new Student(r));
  }

  async findByExpediente(expediente) {
    const [rows] = await pool.execute(
      'SELECT * FROM estudiante WHERE expediente = ?',
      [expediente],
    );
    return rows.length ? new Student(rows[0]) : null;
  }

  async create(student) {
    const fields = [
      'expediente', 'nombres', 'apellidos', 'cum', 'num_carnet', 'calidad',
      'id_direccion', 'telefono', 'correo', 'id_carrera', 'edad', 'fecha_nac',
      'id_responsable', 'estado_academico', 'institucion_proc', 'anio_ingreso',
      'id_ciclo', 'id_grupo', 'id_plan_estu', 'empleo',
    ];
    const values = fields.map((f) => sanitize(student[f], f));
    await pool.execute(
      `INSERT INTO estudiante
        (expediente, nombres, apellidos, cum, num_carnet, calidad, id_direccion,
         telefono, correo, id_carrera, edad, fecha_nac, id_responsable,
         estado_academico, institucion_proc, anio_ingreso, id_ciclo,
         id_grupo, id_plan_estu, empleo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values,
    );
    return student;
  }

  async update(expediente, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE_FIELDS.includes(k));
    if (keys.length === 0) return this.findByExpediente(expediente);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => sanitize(data[k], k)), expediente];
    await pool.execute(`UPDATE estudiante SET ${sets} WHERE expediente = ?`, values);
    return this.findByExpediente(expediente);
  }

  async delete(expediente) {
    await pool.execute('DELETE FROM estudiante WHERE expediente = ?', [expediente]);
  }
}
