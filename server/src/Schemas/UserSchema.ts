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
  document: z.string({
    invalid_type_error: 'El documento es requerido',
    required_error: 'El documento es requerido',
  }).transform((val) => parseInt(val, 10)).refine((value) => !isNaN(value)),
  phone: z.string({
    invalid_type_error: 'El teléfono es requerido',
    required_error: 'El teléfono es requerido',
  }).transform((val) => parseInt(val, 10)).refine((value) => !isNaN(value)),
  email: z.string({
    invalid_type_error: 'El correo debe ser una cadena de texto',
    required_error: 'El correo es requerido',
  }).refine((value) => value.includes('@'), {
    message: 'El correo debe contener un @',
  }),
  company: z.string({
    invalid_type_error: 'La compañía es requerida',
    required_error: 'La compañía es requerida',
  }).transform((val) => parseInt(val, 10)).refine((value) => !isNaN(value)),
  process: z.string({
    invalid_type_error: 'El proceso es requerido',
    required_error: 'El proceso es requerido',
  }).transform((val) => parseInt(val, 10)).refine((value) => !isNaN(value)),
  sub_process: z.string({
    invalid_type_error: 'El sub-proceso es requerido',
    required_error: 'El sub proceso es requerido',
  }).transform((val) => parseInt(val, 10)).refine((value) => !isNaN(value)),
  documentCreator: z.number({
    invalid_type_error: 'El document Creator es requerido',
    required_error: 'El document Creator es requerido',
  })
});

const UserLogin = z.object({
  username: z.string({
    invalid_type_error: 'El nombre de usuario debe ser una cadena de texto',
    required_error: 'El nombre de usuario es requerido',
  }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser una cadena de texto',
    required_error: 'La contraseña es requerida',
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