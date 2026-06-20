import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireApiKey } from './middlewares/auth.js';
import inscripcionesV1 from './routes/v1/inscripciones.js';
import inscripcionesV2 from './routes/v2/inscripciones.js';

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(requireApiKey);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.use('/v1/inscripciones', inscripcionesV1);
app.use('/v2/inscripciones', inscripcionesV2);



app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));