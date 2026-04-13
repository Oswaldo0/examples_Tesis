import { IMateriaRepository } from '../../domain/repositories/IMateriaRepository.js';
import { Materia } from '../../domain/entities/Materia.js';
import { pool } from '../../../../config/database.js';

const UPDATABLE = ['nombre', 'id_ciclo', 'estado', 'descripcion'];

export class MySQLMateriaRepository extends IMateriaRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM materia');
    return rows.map((r) => new Materia(r));
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM materia WHERE id = ?', [id]);
    return rows.length ? new Materia(rows[0]) : null;
  }

  async create(data) {
    const materia = new Materia(data);
    const [result] = await pool.execute(
      'INSERT INTO materia (nombre, id_ciclo, estado, descripcion) VALUES (?, ?, ?, ?)',
      [materia.nombre, materia.id_ciclo, materia.estado, materia.descripcion],
    );
    return { ...materia, id: result.insertId };
  }

  async update(id, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE.includes(k));
    if (keys.length === 0) return this.findById(id);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    await pool.execute(`UPDATE materia SET ${sets} WHERE id = ?`, [...keys.map((k) => data[k]), id]);
    return this.findById(id);
  }

  async delete(id) {
    await pool.execute('DELETE FROM materia WHERE id = ?', [id]);
  }
}
