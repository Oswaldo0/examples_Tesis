import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';

const studentRoutes = Router();

studentRoutes.get('/', StudentController.getAll);
studentRoutes.get('/:expediente', StudentController.getOne);
studentRoutes.post('/', StudentController.create);
studentRoutes.put('/:expediente', StudentController.update);
studentRoutes.delete('/:expediente', StudentController.remove);

export { studentRoutes };
