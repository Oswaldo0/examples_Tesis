import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool(env.db);

export const connectDatabase = async () => {
  const connection = await pool.getConnection();
  connection.release();
  console.log(`Conectado a MySQL: ${env.db.database}@${env.db.host}:${env.db.port}`);
};
