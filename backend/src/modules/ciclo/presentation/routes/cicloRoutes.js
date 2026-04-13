import { Router } from 'express';
import { CicloController } from '../controllers/CicloController.js';

const cicloRoutes = Router();

cicloRoutes.get('/', CicloController.getAll);
cicloRoutes.get('/:id', CicloController.getOne);
cicloRoutes.post('/', CicloController.create);
cicloRoutes.put('/:id', CicloController.update);
cicloRoutes.delete('/:id', CicloController.remove);

export { cicloRoutes };
