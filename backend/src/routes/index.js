import { Router } from 'express';
import { studentRoutes } from '../modules/students/presentation/routes/studentRoutes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

apiRouter.use('/students', studentRoutes);

export { apiRouter };
