import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

connectDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Backend corriendo en el puerto ${env.port}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  });
