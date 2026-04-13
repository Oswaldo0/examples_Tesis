import { Router } from 'express';
import { MateriaController } from '../controllers/MateriaController.js';

const materiaRoutes = Router();

materiaRoutes.get('/', MateriaController.getAll);
materiaRoutes.get('/:id', MateriaController.getOne);
materiaRoutes.post('/', MateriaController.create);
materiaRoutes.put('/:id', MateriaController.update);
materiaRoutes.delete('/:id', MateriaController.remove);

export { materiaRoutes };
