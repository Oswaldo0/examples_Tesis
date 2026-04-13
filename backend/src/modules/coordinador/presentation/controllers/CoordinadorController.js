import { MySQLCoordinadorRepository } from '../../infrastructure/repositories/MySQLCoordinadorRepository.js';
import { CoordinadorService } from '../../application/services/CoordinadorService.js';
import { AppError } from '../../../../shared/errors/AppError.js';

const service = new CoordinadorService(new MySQLCoordinadorRepository());

export class CoordinadorController {
  static async getAll(_req, res, next) {
    try { res.status(200).json(await service.listAll()); }
    catch (err) { next(err); }
  }

  static async getOne(req, res, next) {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) throw new AppError('Coordinador no encontrado', 404);
      res.status(200).json(item);
    } catch (err) { next(err); }
  }

  static async create(req, res, next) {
    try {
      const { id_catedratico, id_rol, id_facultad, anio_asignacion, correo, password } = req.body;
      if (!correo || !password) throw new AppError('correo y password son requeridos', 400);
      res.status(201).json(await service.create({ id_catedratico, id_rol, id_facultad, anio_asignacion, correo, password }));
    } catch (err) { next(err); }
  }

  static async update(req, res, next) {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      if (!item) throw new AppError('Coordinador no encontrado', 404);
      res.status(200).json(item);
    } catch (err) { next(err); }
  }

  static async remove(req, res, next) {
    try { await service.delete(Number(req.params.id)); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
