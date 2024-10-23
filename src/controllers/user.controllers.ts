import { findUserServices, loginUserServices, registerUserServices, findUserServicesById, forgotPasswordServices, asignTokenServices, resetPasswordService } from '../services/user.services'
import { validateUser, validateUserLogin } from '../Schemas/UserSchema'
import { Request, Response } from 'express'
import cryto from 'node:crypto'

const JWT_EXPIRES = process.env.JWT_EXPIRES_IN as string
const JWT_SECRET = process.env.JWT_SECRET as string
const NODE_ENV = process.env.ENTORNO as string

import jwt from 'jsonwebtoken'

import { Company, Procces, Sub_Procces } from '../utils/Definiciones'
import { verifyToken } from '../utils/verifyToken'
import { isMainError } from '../utils/funtions'
import { CustomError } from '../class/ClassErrorSql'

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await validateUser(req.body)

    if (result.error) {
      const meesage = result.error.issues[0].message
      return res.status(400).json({ error: meesage || 'Error en los datos enviados' })
    }

    const userCreated = await registerUserServices(result.data)

    if (!userCreated) {
      return res.status(400).json({ message: 'Error al crear el usuario' })
    }

    return res.status(201).json('Usuario creado correctamente')
  } catch (error: unknown) {
    console.log(error);
    if (isMainError(error)) {
      return res.status(400).json({ errorCode: error.parent.code, message: error.parent.sqlMessage })
    } else if (error instanceof Error) {
      return res.status(500).json({ message: 'Internal server error' })
    } else {
      return res.status(500).json({ message: 'Error desconocido contacte al administrado del sistema' })
    }
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await validateUserLogin(req.body);

    if (result.error) return res.status(400).json(result.error.issues[0].message);

    const user = await loginUserServices(result.data);

    const app = result.data.app;

    const usuario = {
      id: user.id,
      names: user.names,
      lastnames: user.lastNames,
      document: user.document,
      username: user.username,
      email: user.email,
      company: Company(user.company),
      process: Procces(user.process),
      sub_process: Sub_Procces(user.sub_process),
    }

    jwt.sign(usuario, JWT_SECRET, { expiresIn: JWT_EXPIRES }, (err, token) => {
      if (err) throw err;
      return res.cookie(app, token, {
        sameSite: NODE_ENV === 'dev' ? 'lax' : 'none',
        secure: NODE_ENV === 'dev' ? false : true,
      })
        .status(200).json({ message: 'Login successful' });
    });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      return res.status(400).json({ message: error.message, description: error.description });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const UserByToken = async (req: Request, res: Response) => {
  
  try {
    const app: string = req.query.app as string;
    const token = req.cookies[app];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = await verifyToken(token, JWT_SECRET);
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
        company: Company(user.company),
        process: Procces(user.process),
        sub_process: Sub_Procces(user.sub_process),
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
      company: Company(result.company),
      process: Procces(result.process),
      sub_process: Sub_Procces(result.sub_process),
      state: result.state,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }


    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
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

  if (!token || !password || !confirmPassword) return res.status(400).json({ message: 'token y contraseña son requeridos' })
  if (password !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' })

  try {
    const response = await resetPasswordService(token, password)

    if (response[0] === 0) return res.status(404).json({ message: 'Error al intentar restablecer contraseña' })

    return res.status(200).json({ message: 'Contraseña restablecida correctamente' })
  } catch (error) {
    return res.status(500).json(error)
  }
}
