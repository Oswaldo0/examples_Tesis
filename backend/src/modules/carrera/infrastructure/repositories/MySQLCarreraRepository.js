import { ICarreraRepository } from '../../domain/repositories/ICarreraRepository.js';
import { Carrera } from '../../domain/entities/Carrera.js';
import { pool } from '../../../../config/database.js';

const UPDATABLE = ['nombre', 'id_facultad', 'id_plan_estudio', 'ciclo', 'estado', 'id_horario'];

export class MySQLCarreraRepository extends ICarreraRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM carrera');
    return rows.map((r) => new Carrera(r));
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM carrera WHERE id = ?', [id]);
    return rows.length ? new Carrera(rows[0]) : null;
  }

  async create(data) {
    const carrera = new Carrera(data);
    const [result] = await pool.execute(
      'INSERT INTO carrera (nombre, id_facultad, id_plan_estudio, ciclo, estado, id_horario) VALUES (?, ?, ?, ?, ?, ?)',
      [carrera.nombre, carrera.id_facultad, carrera.id_plan_estudio, carrera.ciclo, carrera.estado, carrera.id_horario],
    );
    return { ...carrera, id: result.insertId };
  }

  async update(id, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE.includes(k));
    if (keys.length === 0) return this.findById(id);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    await pool.execute(`UPDATE carrera SET ${sets} WHERE id = ?`, [...keys.map((k) => data[k]), id]);
    return this.findById(id);
  }

  async delete(id) {
    await pool.execute('DELETE FROM carrera WHERE id = ?', [id]);
  }
}
