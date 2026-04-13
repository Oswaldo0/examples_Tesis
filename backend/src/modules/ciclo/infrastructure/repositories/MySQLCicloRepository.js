import { ICicloRepository } from '../../domain/repositories/ICicloRepository.js';
import { Ciclo } from '../../domain/entities/Ciclo.js';
import { pool } from '../../../../config/database.js';

const UPDATABLE = ['ciclo', 'anio'];

export class MySQLCicloRepository extends ICicloRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM ciclo');
    return rows.map((r) => new Ciclo(r));
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM ciclo WHERE id = ?', [id]);
    return rows.length ? new Ciclo(rows[0]) : null;
  }

  async create(data) {
    const ciclo = new Ciclo(data);
    const [result] = await pool.execute(
      'INSERT INTO ciclo (ciclo, anio) VALUES (?, ?)',
      [ciclo.ciclo, ciclo.anio],
    );
    return { ...ciclo, id: result.insertId };
  }

  async update(id, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE.includes(k));
    if (keys.length === 0) return this.findById(id);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    await pool.execute(`UPDATE ciclo SET ${sets} WHERE id = ?`, [...keys.map((k) => data[k]), id]);
    return this.findById(id);
  }

  async delete(id) {
    await pool.execute('DELETE FROM ciclo WHERE id = ?', [id]);
  }
}
