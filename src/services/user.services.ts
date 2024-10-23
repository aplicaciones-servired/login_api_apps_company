import { UserType, UserLoginType } from '../Schemas/UserSchema';
import { CustomError } from '../class/ClassErrorSql';
import { User } from '../model/user.model';
import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10);
const USERNAME_PREFIX = 'CP';


const generateUsername = (document: string): string => {
  return `${USERNAME_PREFIX}${document}`;
};

const generatePassword = (document: string): string => {
  const threeLastDocument = document.slice(-3);
  const pass = `${USERNAME_PREFIX}${threeLastDocument}`;
  return bcrypt.hashSync(pass, BCRYPT_SALT_ROUNDS);
};

export const registerUserServices = async (user: UserType) => {
  try {
    const username = generateUsername(user.document.toString());
    const password = generatePassword(user.document.toString());
    const state = true;

    await User.sync();
    const userCreated = await User.create({ ...user, username, password, state });

    return userCreated;
  } catch (error) {
    throw error;
  }
};

export const loginUserServices = async (user: UserLoginType) => {
  try {
    const userFound = await User.findOne({ where: { username: user.username } });

    if (!userFound) {
      throw new CustomError('Usuario no encontrado', 'El usuario proporcionado no existe.');
    }

    const passwordMatch = bcrypt.compareSync(user.password, userFound.password);

    if (!passwordMatch) {
      throw new CustomError('Contraseña incorrecta', 'La contraseña proporcionada no coincide con la registrada.');
    }

    if (userFound.state === false) {
      throw new CustomError('Usuario inactivo', 'El usuario se encuentra inactivo y no puede iniciar sesión.');
    }

    return userFound;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError('Error del servidor', 'Ocurrió un error inesperado en el servidor.');
    }
  }
}

export const getUserByToken = async (token: string) => {
  try {
    const user = await User.findOne({ where: { username: token } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export const findUserServices = async () => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password', 'password2', 'resetPasswordToken', 'resetPasswordExpires'] } });
    return users;
  } catch (error) {
    throw error;
  }
}

export const findUserServicesById = async (id: string) => {
  try {
    const user = await User.findOne({ where: { document: id }, attributes: { exclude: ['password', 'password2', 'resetPasswordToken', 'resetPasswordExpires'] } })
    return user;
  } catch (error) {
    throw error;
  }
}

export const forgotPasswordServices = async (document: number, email: string) => {
  try {
    const user = await User.findOne({ where: { document, email } });

    if (!user) {
      throw new Error('Usuario no encontrado documento o correo invalidos');
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export const asignTokenServices = async (token: string, time: Date, document: number) => {
  try {
    const result = await User.update({ resetPasswordToken: token, resetPasswordExpires: time },
      { where: { document } });

    return result;
  } catch (error) {
    throw error;
  }
}

export const resetPasswordService = async (token: string, password: string) => {
  try {
    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user) throw new Error('Token invalido');

    const now = new Date();
    if (user.dataValues.resetPasswordExpires){
      if (now > user.dataValues.resetPasswordExpires) throw new Error('Token expirado, se debe solicitar uno nuevo');
    }

    const hasPass = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);

    const result = User.update({ password: hasPass, resetPasswordToken: null, resetPasswordExpires: null },
      { where: { resetPasswordToken: token } });

    return result;
  } catch (error) {
    throw error;
  }
}