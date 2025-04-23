import { colorize, consoleColors } from './utils/colorsConsole';
import { POWERBI } from './connections/login_unificado';
import { PORT, VERSION } from './configs/envSchema';
import { userRouter } from './routes/user.routes';
import corsMiddleware from './configs/corsConfig';

import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

const app = express();

// TODO: middlewares para el manejo de peticiones
app
  .disable('x-powered-by')
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(morgan('dev'))
  .use(corsMiddleware)
  .use(cookieParser());

// TODO: rutas de la API
app.use(VERSION, userRouter);

app.listen(PORT, () => {
  console.log(`Server iniciado en el puerto http://localhost:${PORT}`);
});

// Test de conexión a la base de datos de PowerBI
POWERBI.authenticate()
  .then(() => console.log(colorize('Conexión a la base de datos exitosa', consoleColors.fgGreen)))
  .catch(error => {
    console.error(colorize('Error de conexión a la base de datos', consoleColors.fgRed), error);
    process.exit(1);
  })
  .finally(() => {
    console.log(colorize('Test de conexión con la bd finalizado ...', consoleColors.fgYellow));
  })