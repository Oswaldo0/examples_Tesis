import { Router } from 'express';
import { CoordinadorController } from '../controllers/CoordinadorController.js';

const coordinadorRoutes = Router();

coordinadorRoutes.get('/', CoordinadorController.getAll);
coordinadorRoutes.get('/:id', CoordinadorController.getOne);
coordinadorRoutes.post('/', CoordinadorController.create);
coordinadorRoutes.put('/:id', CoordinadorController.update);
coordinadorRoutes.delete('/:id', CoordinadorController.remove);

export { coordinadorRoutes };
