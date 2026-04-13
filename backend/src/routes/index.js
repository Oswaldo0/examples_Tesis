import { Router } from 'express';
import { pool } from '../config/database.js';
import { studentRoutes } from '../modules/students/presentation/routes/studentRoutes.js';
import { facultadRoutes } from '../modules/facultad/presentation/routes/facultadRoutes.js';
import { cicloRoutes } from '../modules/ciclo/presentation/routes/cicloRoutes.js';
import { carreraRoutes } from '../modules/carrera/presentation/routes/carreraRoutes.js';
import { materiaRoutes } from '../modules/materia/presentation/routes/materiaRoutes.js';
import { coordinadorRoutes } from '../modules/coordinador/presentation/routes/coordinadorRoutes.js';

const apiRouter = Router();

// ── Catálogos simples (tablas referenciadas por FK del estudiante) ────────────
const ALLOWED_CATALOG_TABLES = new Set([
  'direccion',
  'responsable',
  'grupo',
  'plan_estu',
]);

const catalogTable = (tableName) => async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM \`${tableName}\``);
    res.json(rows);
  } catch (_err) {
    // Si la tabla no existe devolvemos arreglo vacío para no romper el front
    res.json([]);
  }
};

const insertCatalog = (tableName) => async (req, res, next) => {
  try {
    if (!ALLOWED_CATALOG_TABLES.has(tableName)) {
      return res.status(400).json({ message: 'Tabla de catálogo no permitida' });
    }

    const body = req.body || {};
    const keys = Object.keys(body).filter((k) => k !== 'id' && body[k] !== undefined);

    if (keys.length === 0) {
      return res.status(400).json({ message: 'Debes enviar al menos un campo para insertar' });
    }

    const columns = keys.map((k) => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((k) => body[k]);

    const [result] = await pool.execute(
      `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`,
      values,
    );

    res.status(201).json({ id: result.insertId, ...body });
  } catch (err) {
    next(err);
  }
};

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

// Catálogos FK del estudiante
apiRouter.get('/direcciones', catalogTable('direccion'));
apiRouter.get('/responsables', catalogTable('responsable'));
apiRouter.get('/grupos', catalogTable('grupo'));
apiRouter.get('/planes-estudio', catalogTable('plan_estu'));
apiRouter.post('/direcciones', insertCatalog('direccion'));
apiRouter.post('/responsables', insertCatalog('responsable'));
apiRouter.post('/grupos', insertCatalog('grupo'));
apiRouter.post('/planes-estudio', insertCatalog('plan_estu'));

export { apiRouter };
