import { findUserServices, loginUserServices, registerUserServices, findUserServicesById, forgotPasswordServices, asignTokenServices, resetPasswordService } from '../services/user.services'
import { getCompanyName, getProccesName, getSubProccesName } from '../utils/Definiciones'
import { JWT_SECRECT, JWT_EXPIRES, ENTORNO } from '../configs/envSchema'
import { validateUser, validateUserLogin } from '../Schemas/UserSchema'
import { SendEmailRestorePassword } from '../services/nodemailer'
import { verifyToken } from '../utils/verifyToken'
import { Request, Response } from 'express'
import cryto from 'node:crypto'
import jwt from 'jsonwebtoken'

export const createUser = async (req: Request, res: Response) => {
  const { success, data, error } = await validateUser(req.body)

  if (!success) return res.status(400).json({ message: error.issues[0].message })

  try {
    await registerUserServices(data)
    return res.status(201).json('Usuario creado correctamente')
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { success, data, error } = await validateUserLogin(req.body);

  if (!success) return res.status(400).json({ message: error.format() });

  try {
    const user = await loginUserServices(data);

    const usuario = {
      id: user.id,
      names: user.names,
      lastnames: user.lastNames,
      document: user.document,
      username: user.username,
      email: user.email,
      company: getCompanyName(user.company),
      process: getProccesName(user.process),
      sub_process: getSubProccesName(user.sub_process),
    }

    jwt.sign(usuario, JWT_SECRECT, { expiresIn: JWT_EXPIRES }, (err, token) => {
      if (err) throw err;
      return res.cookie(
        'authTokenGane',
        token, {
        httpOnly: true,
        secure: ENTORNO === 'dev' ? false : true,
        sameSite: ENTORNO === 'dev' ? 'lax' : 'strict'
      })
        .status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const UserByToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"

    try {
      const decoded = await verifyToken(token, JWT_SECRECT);
      return res.status(200).json(decoded);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.headers.cookie as string;

  if (!token) {
    return res.status(400).json({ message: 'Token not found' });
  }

  try {
    const clearToken = token.split('=')[0]
    return res.clearCookie(clearToken).status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const findAllUsers = async (req: Request, res: Response) => {
  try {
    const results = await findUserServices();

    const users = results.map(user => {
      return {
        id: user.id,
        document: user.document,
        phone: user.phone,
        names: user.names,
        lastnames: user.lastNames,
        email: user.email,
        company: getCompanyName(user.company),
        process: getProccesName(user.process),
        sub_process: getSubProccesName(user.sub_process),
        state: user.state,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

    if (users.length === 0) {
      return res.status(404).json({ message: 'Users not found in database' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const document = req.params.id;
    const result = await findUserServicesById(document);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = {
      id: result.id,
      document: result.document,
      phone: result.phone,
      names: result.names,
      lastnames: result.lastNames,
      username: result.username,
      email: result.email,
      company: getCompanyName(result.company),
      process: getProccesName(result.process),
      sub_process: getSubProccesName(result.sub_process),
      state: result.state,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }


    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { document, email } = req.body;

  if (!document || !email) {
    return res.status(400).json({ message: 'documento y correo son requeridos' });
  }

  try {
    const user = await forgotPasswordServices(document, email);

    if (user.dataValues.id === null) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = cryto.randomBytes(20).toString('hex');
    const now = new Date(); now.setMinutes(now.getMinutes() + 10);

    const result = await asignTokenServices(token, now, document);

    if (result[0] === 0) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const response = await SendEmailRestorePassword({ email: user.dataValues.email, token });
    console.log(response);

    return res.status(200).json({ message: 'Solicitud Generada Correctamente' });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body

  if (!token || !password || !confirmPassword) return res.status(400).json({ message: 'token y contraseñas son requeridas' })
  if (password !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' })

  try {
    const response = await resetPasswordService(token, password)

    if (response[0] === 0) return res.status(404).json({ message: 'Error al intentar restablecer contraseña' })

    return res.status(200).json({ message: 'Contraseña restablecida correctamente' })
  } catch (error) {
    if (error instanceof Error) return res.status(400).json({ message: error.message })
    return res.status(500).json('Internal server error')
  }
}
