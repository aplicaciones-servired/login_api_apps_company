import z from 'zod';

const User = z.object({
  names: z.string({
    invalid_type_error: 'El nombre debe ser una cadena de texto',
    required_error: 'El nombre es requerido',
  }).min(4, { message: 'Los nombres son requeridos' }),
  lastNames: z.string({
    invalid_type_error: 'El apellido debe ser una cadena de texto',
    required_error: 'El apellido es requerido',
  }).min(4, { message: 'Los apellidos son requeridos' }),
  document: z.number({
    invalid_type_error: 'El documento es requerido',
    required_error: 'El documento es requerido',
  }).min(6, { message: 'El documento es requerido' }),
  phone: z.number({
    invalid_type_error: 'El teléfono es requerido',
    required_error: 'El teléfono es requerido',
  }).min(6, { message: 'El teléfono es requerido' }),
  email: z.string({
    invalid_type_error: 'El correo debe ser una cadena de texto',
    required_error: 'El correo es requerido',
  }).refine((value) => value.includes('@'), {
    message: 'El correo debe contener un @',
  }),
  company: z.number({
    invalid_type_error: 'La compañía es requerida',
    required_error: 'La compañía es requerida',
  }).int().min(0).max(2),
  process: z.number({
    invalid_type_error: 'El proceso es requerido',
    required_error: 'El proceso es requerido',
  }).int().min(0).max(12),
  sub_process: z.number({
    invalid_type_error: 'El sub-proceso es requerido',
    required_error: 'El sub proceso es requerido',
  }).int().min(0).max(30)
});

const UserLogin = z.object({
  username: z.string({
    invalid_type_error: 'El nombre de usuario debe ser una cadena de texto',
    required_error: 'El nombre de usuario es requerido',
  }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser una cadena de texto',
    required_error: 'La contraseña es requerida',
  }),
  app: z.string({
    invalid_type_error: 'La aplicación debe ser una cadena de texto',
    required_error: 'La aplicación es requerida',
  })
})

export type UserType = z.infer<typeof User>;
export type UserLoginType = z.infer<typeof UserLogin>;

export function validateUser(data: unknown) {
  return User.safeParseAsync(data);
}

export function validateUserLogin(data: unknown) {
  return UserLogin.safeParseAsync(data);
}