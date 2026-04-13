import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'BD_USO_SONSONATE',
};

try {
  const connection = await mysql.createConnection(config);
  const [rows] = await connection.execute('SELECT 1 AS ok, NOW() AS server_time');
  console.log('DB_OK', rows[0]);
  await connection.end();
} catch (error) {
  console.error('DB_ERROR', error.code || '', error.message || error);
  process.exit(1);
}
