import { IFacultadRepository } from '../../domain/repositories/IFacultadRepository.js';
import { Facultad } from '../../domain/entities/Facultad.js';
import { pool } from '../../../../config/database.js';

const UPDATABLE = ['nombre', 'descripcion', 'anio_de_creacion', 'estado'];

export class MySQLFacultadRepository extends IFacultadRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM facultad');
    return rows.map((r) => new Facultad(r));
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM facultad WHERE id = ?', [id]);
    return rows.length ? new Facultad(rows[0]) : null;
  }

  async create(data) {
    const facultad = new Facultad(data);
    const [result] = await pool.execute(
      'INSERT INTO facultad (nombre, descripcion, anio_de_creacion, estado) VALUES (?, ?, ?, ?)',
      [facultad.nombre, facultad.descripcion, facultad.anio_de_creacion, facultad.estado],
    );
    return { ...facultad, id: result.insertId };
  }

  async update(id, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE.includes(k));
    if (keys.length === 0) return this.findById(id);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    await pool.execute(`UPDATE facultad SET ${sets} WHERE id = ?`, [...keys.map((k) => data[k]), id]);
    return this.findById(id);
  }

  async delete(id) {
    await pool.execute('DELETE FROM facultad WHERE id = ?', [id]);
  }
}
