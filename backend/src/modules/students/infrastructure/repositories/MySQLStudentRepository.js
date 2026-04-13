import { pool } from '../../../../config/database.js';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { Student } from '../../domain/entities/Student.js';

const UPDATABLE_FIELDS = [
  'nombres', 'apellidos', 'cum', 'num_carnet', 'calidad', 'id_direccion',
  'telefono', 'correo', 'id_carrera', 'edad', 'fecha_nac', 'id_responsable',
  'estado_academico', 'institucion_proc', 'anio_ingreso', 'id_ciclo',
  'id_grupo', 'id_plan_estu', 'empleo',
];

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
    const {
      expediente, nombres, apellidos, cum, num_carnet, calidad,
      id_direccion, telefono, correo, id_carrera, edad, fecha_nac,
      id_responsable, estado_academico, institucion_proc, anio_ingreso,
      id_ciclo, id_grupo, id_plan_estu, empleo,
    } = student;
    await pool.execute(
      `INSERT INTO estudiante
        (expediente, nombres, apellidos, cum, num_carnet, calidad, id_direccion,
         telefono, correo, id_carrera, edad, fecha_nac, id_responsable,
         estado_academico, institucion_proc, anio_ingreso, id_ciclo,
         id_grupo, id_plan_estu, empleo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        expediente, nombres, apellidos, cum, num_carnet, calidad, id_direccion,
        telefono, correo, id_carrera, edad, fecha_nac, id_responsable,
        estado_academico, institucion_proc, anio_ingreso, id_ciclo,
        id_grupo, id_plan_estu, empleo,
      ],
    );
    return student;
  }

  async update(expediente, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE_FIELDS.includes(k));
    if (keys.length === 0) return this.findByExpediente(expediente);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => data[k]), expediente];
    await pool.execute(`UPDATE estudiante SET ${sets} WHERE expediente = ?`, values);
    return this.findByExpediente(expediente);
  }

  async delete(expediente) {
    await pool.execute('DELETE FROM estudiante WHERE expediente = ?', [expediente]);
  }
}
