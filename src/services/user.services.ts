import { UserType, UserLoginType } from '../Schemas/UserSchema';
import { SALT } from '../configs/envSchema';
import { User } from '../model/user.model';
import bcrypt from 'bcryptjs';

const USERNAME_PREFIX = 'CP';

const generateUsername = (document: string): string => {
  return `${USERNAME_PREFIX}${document}`;
};

const generatePassword = (document: string): string => {
  const threeLastDocument = document.slice(-3);
  const pass = `${USERNAME_PREFIX}${threeLastDocument}`;
  return bcrypt.hashSync(pass, SALT);
};

export const registerUserServices = async (user: UserType) => {
  const username = generateUsername(user.document.toString());
  const password = generatePassword(user.document.toString());
  const state = true;

  await User.sync();

  const userCreated = await User.create({ ...user, username, password, state });

  return userCreated;
};

export const loginUserServices = async (user: UserLoginType) => {
  const userFound = await User.findOne({ where: { username: user.username } });

  if (!userFound) {
    throw new Error('Usuario no encontrado o no existe');
  }

  const passwordMatch = bcrypt.compareSync(user.password, userFound.password);

  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta o no coincide');
  }

  if (userFound.state === false) {
    throw new Error('Usuario se encuentra inactivo');
  }

  return userFound;
}

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
    throw new Error('Usuario no encontrado documento o correo invalidos');
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

  const hasPass = bcrypt.hashSync(password, SALT);

  const result = User.update({ password: hasPass, resetPasswordToken: null, resetPasswordExpires: null },
    { where: { resetPasswordToken: token } });

  return result;
}