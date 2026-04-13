import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';

const studentRoutes = Router();

studentRoutes.get('/', StudentController.getAll);
studentRoutes.post('/', StudentController.create);

export { studentRoutes };
