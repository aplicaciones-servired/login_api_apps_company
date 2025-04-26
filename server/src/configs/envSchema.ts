import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().min(2, 'El puerto es requerido').default('3000'),
  VERSION: z.string().min(1, 'La versión es requerida'),
  JWT_SECRECT: z.string().min(8, 'El JWT_SECRET es requerido, min 8 caracteres'),
  SALT: z.string().min(1, 'El SALT es requerido'),
  DB_USER: z.string().min(4, 'El usuario de la base de datos es requerido'),
  DB_PASS: z.string().min(4, 'La contraseña de la base de datos es requerida'),
  DB_HOST: z.string().min(4, 'El host de la base de datos es requerido'),
  DB_NAME: z.string().min(4, 'El nombre de la base de datos es requerido'),
  DB_PORT: z.string().min(4, 'El puerto de la base de datos es requerido'),
  ENTORNO: z.string().min(3, 'El entorno es requerido').default('dev'),
  CORS_ORIGINS: z.string().min(2, 'Los origenes permitidos son requeridos'),
  EMAIL_USER_GMAIL: z.string().min(2, 'El email de gmail es requerido'),
  EMAIL_PASS_GMAIL: z.string().min(2, 'La contraseña de gmail es requerida'),
  JWT_NAME_TOKEN: z.string().min(2, 'El nombre del token es requerido')
})

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error('Error en la configuración de las variables de entorno: ', error.format());
  process.exit(1);
}

export const {
  PORT,
  VERSION,
  JWT_SECRECT,
  DB_USER,
  SALT,
  DB_PASS,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  ENTORNO,
  CORS_ORIGINS,
  EMAIL_USER_GMAIL,
  EMAIL_PASS_GMAIL,
  JWT_NAME_TOKEN
} = data;