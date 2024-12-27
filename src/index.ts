import { POWERBI } from './connections/login_unificado';
import { PORT, VERSION } from './configs/envSchema';
import { userRouter } from './routes/user.routes';
import corsMiddleware from './configs/corsConfig';

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

const app = express();

// TODO: middlewares para el manejo de peticiones
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware);

// TODO: rutas de la API
app.use(VERSION, userRouter);

app.listen(PORT, () => {
  console.log(`Server iniciado en el puerto http://localhost:${PORT}`);
});

// Test de conexión a la base de datos de PowerBI
POWERBI.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(error => console.error('No se pudo conectar a la base de datos:', error));