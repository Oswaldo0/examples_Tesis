import { Router } from 'express';
import { FacultadController } from '../controllers/FacultadController.js';

const facultadRoutes = Router();

facultadRoutes.get('/', FacultadController.getAll);
facultadRoutes.get('/:id', FacultadController.getOne);
facultadRoutes.post('/', FacultadController.create);
facultadRoutes.put('/:id', FacultadController.update);
facultadRoutes.delete('/:id', FacultadController.remove);

export { facultadRoutes };
