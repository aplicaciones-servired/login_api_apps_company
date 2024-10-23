import corsMiddleware from './corsConfig';

import cookieParser from 'cookie-parser';
import testDB, { PORT } from './configs';
import express from 'express';
import morgan from 'morgan';

import { userRouter } from './routes/user.routes';

const v1 = '/api/v1';

const app = express();

// TODO: middlewares de express
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(corsMiddleware);

// TODO: rutas de la API
app.use(v1, userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// TODO: test database connection
testDB();
