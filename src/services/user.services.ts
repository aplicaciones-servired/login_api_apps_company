import { comparePasswords, generatePassword, generateUsername, hashNewPassword } from '../utils/funtions';
import { ValidationErrorItem, UniqueConstraintError } from 'sequelize';
import { UserType, UserLoginType } from '../Schemas/UserSchema';
import { connectionPool } from '../connections/Mysql';
import { ErrorMessages } from '../utils/eums';
import { User } from '../model/user.model';
import { RowDataPacket } from 'mysql2';
import { colorize, consoleColors } from '../utils/colorsConsole';

interface UserRow extends RowDataPacket {
  id: string;
  names: string;
  lastnames: string;
  password: string;
  document: number;
  username: string;
  email: string;
  company: number;
  process: number;
  sub_process: number;
  state: boolean;
}

export const registerUserServices = async (user: UserType) => {
  await User.sync();

  const userFound = await User.findOne({ where: { document: user.document } });

  if (userFound) throw new Error('El usuario ya se encuentra registrado con el documento ingresado');

  const username = generateUsername(user.document.toString());
  const password = await generatePassword(user.document.toString());
  const state = true;

  try {
    const userCreated = await User.create({ ...user, username, password, state });
    return userCreated;
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      const errors: ValidationErrorItem = err.errors[0];
      throw new Error(`El campo [ ${errors.path} ] ya se encuentra registrado con valor ${errors.value}`);
    };
  }
}

export const loginUserServices = async (user: UserLoginType) => {
  let connection = await connectionPool()

  try {
    const { username, password } = user

    if (!connection) {
      throw new Error('Error al conectar a la base de datos')
    }

    const [userFound] = await connection.execute<UserRow[]>('SELECT id, names, lastnames, password, document, username, email, company, sub_process, state FROM login_users WHERE username = ?', [username]);

    console.log(userFound);
    

    /*
    const userFound = await User.findOne({ where: { username: user.username } });
    */
    if (!userFound) throw new Error(ErrorMessages.USER_NOT_FOUND);

    const passwordMatch = await comparePasswords(password, userFound[0].password);

    if (!passwordMatch) throw new Error(ErrorMessages.PASSWORD_INCORRECT);

    if (userFound[0].state === false) throw new Error(ErrorMessages.USER_INACTIVE);

    return userFound[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(colorize(consoleColors.fgRed, error.message));
      throw new Error(error.message);
    } else {
      console.log(colorize(consoleColors.fgRed, 'Error inesperado al iniciar sesión'));
      throw new Error('Error inesperado al iniciar sesión');
    }
  } 
};

export const getUserByToken = async (token: string) => {
  const user = await User.findOne({ where: { username: token } });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
}

export const findUserServices = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password', 'password2', 'resetPasswordToken', 'resetPasswordExpires'] } });
  return users;
}

export const findUserServicesById = async (id: string) => {
  const user = await User.findOne({ where: { document: id }, attributes: { exclude: ['password', 'password2', 'resetPasswordToken', 'resetPasswordExpires'] } })
  return user;
}

export const forgotPasswordServices = async (document: number, email: string) => {
  const user = await User.findOne({ where: { document, email } });

  if (!user) {
    throw new Error('Usuario no encontrado documento o correo invalidos y/o no coinciden');
  }
  return user;
}

export const asignTokenServices = async (token: string, time: Date, document: number) => {
  const result = await User.update(
    { resetPasswordToken: token, resetPasswordExpires: time },
    { where: { document } });
  return result;
}

export const resetPasswordService = async (token: string, password: string) => {

  const user = await User.findOne({ where: { resetPasswordToken: token } });
  if (!user) throw new Error('Token invalido');

  const now = new Date();
  if (user.dataValues.resetPasswordExpires) {
    if (now > user.dataValues.resetPasswordExpires) throw new Error('Token expirado, se debe solicitar uno nuevo');
  }

  const hasPass = await hashNewPassword(password);

  const result = User.update({ password: hasPass, resetPasswordToken: null, resetPasswordExpires: null },
    { where: { resetPasswordToken: token } });

  return result;
}
