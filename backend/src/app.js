import express from 'express';
import { apiRouter } from './routes/index.js';
import { notFound } from './shared/middleware/notFound.js';
import { errorHandler } from './shared/middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
