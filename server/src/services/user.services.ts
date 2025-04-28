import { comparePasswords, generatePassword, generateUsername, hashNewPassword } from '../utils/funtions';
import { ValidationErrorItem, UniqueConstraintError } from 'sequelize';
import { UserType, UserLoginType } from '../Schemas/UserSchema';
import { compare, compareSync } from 'bcryptjs';
import { ErrorMessages } from '../utils/eums';
import { User } from '../model/user.model';

export const registerUserServices = async (user: UserType) => {
  await User.sync();

  const userFound = await User.findOne({ where: { document: user.document } });

  if (userFound) throw new Error('El usuario ya se encuentra registrado con el documento ingresado');

  console.log(user.documentCreator);

  const creator = await User.findOne({ 
    attributes: ['sub_process'],
    where: { document: user.documentCreator }
  } )
  
  if(creator?.dataValues.sub_process.toString() !== '100') throw new Error('Solo El Director de Tecnología puede crear nuevos usuarios');
  if(user.sub_process === 100) throw new Error('Ya existe un super usuario (Director Tecnología)')

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
  const userFound = await User.findOne({ where: { username: user.username } });

  if (!userFound)
    throw new Error(ErrorMessages.USER_NOT_FOUND);

  const passwordMatch = compareSync(user.password, userFound.password);

  if (!passwordMatch)
    throw new Error(ErrorMessages.PASSWORD_INCORRECT);

  if (userFound.state === false)
    throw new Error(ErrorMessages.USER_INACTIVE);

  return userFound;
};

export const getUserByToken = async (token: string) => {
  const user = await User.findOne({ where: { username: token } });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
}

export const findUserServices = async () => {
  const users = await User.findAll({ 
    attributes: { exclude: ['password', 'password2', 'resetPasswordToken', 'resetPasswordExpires'] }, 
    order: [['names', 'ASC']]
  });
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
