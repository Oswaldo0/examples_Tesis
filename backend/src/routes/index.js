import { Router } from 'express';
import { pool } from '../config/database.js';
import { studentRoutes } from '../modules/students/presentation/routes/studentRoutes.js';
import { facultadRoutes } from '../modules/facultad/presentation/routes/facultadRoutes.js';
import { cicloRoutes } from '../modules/ciclo/presentation/routes/cicloRoutes.js';
import { carreraRoutes } from '../modules/carrera/presentation/routes/carreraRoutes.js';
import { materiaRoutes } from '../modules/materia/presentation/routes/materiaRoutes.js';
import { coordinadorRoutes } from '../modules/coordinador/presentation/routes/coordinadorRoutes.js';

const apiRouter = Router();

// Health checks
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

apiRouter.get('/health/db', async (_req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok, NOW() AS server_time');
    res.status(200).json({ status: 'ok', db: rows[0] });
  } catch (err) {
    next(err);
  }
});

// Módulos
apiRouter.use('/students', studentRoutes);
apiRouter.use('/facultades', facultadRoutes);
apiRouter.use('/ciclos', cicloRoutes);
apiRouter.use('/carreras', carreraRoutes);
apiRouter.use('/materias', materiaRoutes);
apiRouter.use('/coordinadores', coordinadorRoutes);

export { apiRouter };
