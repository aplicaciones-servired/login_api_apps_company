import cors from 'cors';

const CORS_ORIGINS: string[] = (process.env.CORS_ORIGINS as string).split(',');

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (CORS_ORIGINS.includes(origin as string) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;