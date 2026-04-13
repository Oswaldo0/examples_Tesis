import { ICoordinadorRepository } from '../../domain/repositories/ICoordinadorRepository.js';
import { Coordinador } from '../../domain/entities/Coordinador.js';
import { pool } from '../../../../config/database.js';

const UPDATABLE = ['id_catedratico', 'id_rol', 'id_facultad', 'anio_asignacion', 'estado', 'correo'];

export class MySQLCoordinadorRepository extends ICoordinadorRepository {
  // Never return password field
  _toEntity(row) {
    const { password: _omit, ...safe } = row;
    return new Coordinador(safe);
  }

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, id_catedratico, id_rol, id_facultad, anio_asignacion, estado, correo FROM coordinador',
    );
    return rows.map((r) => new Coordinador(r));
  }

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, id_catedratico, id_rol, id_facultad, anio_asignacion, estado, correo FROM coordinador WHERE id = ?',
      [id],
    );
    return rows.length ? new Coordinador(rows[0]) : null;
  }

  async create(data) {
    const { id_catedratico, id_rol, id_facultad, anio_asignacion, estado = 'ACTIVO', correo, password } = data;
    const [result] = await pool.execute(
      'INSERT INTO coordinador (id_catedratico, id_rol, id_facultad, anio_asignacion, estado, correo, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id_catedratico, id_rol, id_facultad, anio_asignacion, estado, correo, password],
    );
    return new Coordinador({ id: result.insertId, id_catedratico, id_rol, id_facultad, anio_asignacion, estado, correo });
  }

  async update(id, data) {
    const keys = Object.keys(data).filter((k) => UPDATABLE.includes(k));
    if (keys.length === 0) return this.findById(id);
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    await pool.execute(`UPDATE coordinador SET ${sets} WHERE id = ?`, [...keys.map((k) => data[k]), id]);
    return this.findById(id);
  }

  async delete(id) {
    await pool.execute('DELETE FROM coordinador WHERE id = ?', [id]);
  }
}
