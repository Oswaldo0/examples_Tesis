import { Router } from 'express';
import { CarreraController } from '../controllers/CarreraController.js';

const carreraRoutes = Router();

carreraRoutes.get('/', CarreraController.getAll);
carreraRoutes.get('/:id', CarreraController.getOne);
carreraRoutes.post('/', CarreraController.create);
carreraRoutes.put('/:id', CarreraController.update);
carreraRoutes.delete('/:id', CarreraController.remove);

export { carreraRoutes };
