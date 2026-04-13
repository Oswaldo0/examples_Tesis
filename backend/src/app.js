import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { notFound } from './shared/middleware/notFound.js';
import { errorHandler } from './shared/middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
