import { MySQLMateriaRepository } from '../../infrastructure/repositories/MySQLMateriaRepository.js';
import { MateriaService } from '../../application/services/MateriaService.js';
import { AppError } from '../../../../shared/errors/AppError.js';

const service = new MateriaService(new MySQLMateriaRepository());

export class MateriaController {
  static async getAll(_req, res, next) {
    try { res.status(200).json(await service.listAll()); }
    catch (err) { next(err); }
  }

  static async getOne(req, res, next) {
    try {
      const item = await service.getById(Number(req.params.id));
      if (!item) throw new AppError('Materia no encontrada', 404);
      res.status(200).json(item);
    } catch (err) { next(err); }
  }

  static async create(req, res, next) {
    try { res.status(201).json(await service.create(req.body)); }
    catch (err) { next(err); }
  }

  static async update(req, res, next) {
    try {
      const item = await service.update(Number(req.params.id), req.body);
      if (!item) throw new AppError('Materia no encontrada', 404);
      res.status(200).json(item);
    } catch (err) { next(err); }
  }

  static async remove(req, res, next) {
    try { await service.delete(Number(req.params.id)); res.status(204).send(); }
    catch (err) { next(err); }
  }
}
