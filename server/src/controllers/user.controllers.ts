import { findUserServices, loginUserServices, registerUserServices, findUserServicesById, forgotPasswordServices, asignTokenServices, resetPasswordService, updateState } from '../services/user.services';
import { JWT_SECRECT, ENTORNO, JWT_NAME_TOKEN } from '../configs/envSchema';
import { validateUser, validateUserLogin } from '../Schemas/UserSchema';
import { Company, Process, State, SubProcess } from '../enum/enums';
import { SendEmailRestorePassword } from '../services/nodemailer';
import { verifyToken } from '../utils/verifyToken';
import { Request, Response } from 'express';
import cryto from 'node:crypto';
import jwt from 'jsonwebtoken';

export const optionsUser = async (req: Request, res: Response) => {
  try {
    const options = {
      company: Object.entries(Company)
        .filter(([key, value]) => !isNaN(Number(value))) // Filtra solo los valores numéricos
        .map(([key, value]) => ({ label: key, value: Number(value) })), // Usa la clave como label y el valor numérico como value

      process: Object.entries(Process)
        .filter(([key, value]) => !isNaN(Number(value)))
        .map(([key, value]) => ({ label: key, value: Number(value) })),

      sub_process: Object.entries(SubProcess)
        .filter(([key, value]) => !isNaN(Number(value)))
        .map(([key, value]) => ({ label: key, value: Number(value) })),
    };

    res.status(200).json(options);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { success, data, error } = await validateUser(req.body)
  const document = req.user.document

  if (!success) {
    res.status(400).json({ message: error.issues[0].message })
    return
  }
  try {
    await registerUserServices(data, document)
    res.status(201).json('Usuario creado correctamente')
    return
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
    return
  }
}

export const changeState = async(req: Request, res: Response) => {
  try {
    const data = req.body
    const update = await updateState(data.id, data.newState)
    res.status(200).json({ document: update})
  } catch (error) {
    res.status(500).json('Error al intentar actualizar el estado del usuario')
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { success, data, error } = await validateUserLogin(req.body);

  if (!success) {
    res.status(400).json({ message: error.format() })
    return
  }

  try {
    const user = await loginUserServices(data);

    const usuario = {
      id: user.id,
      names: user.names,
      lastnames: user.lastNames,
      document: user.document,
      username: user.username,
      email: user.email,
      company: Company[user.company],
      process: Process[user.process],
      sub_process: SubProcess[user.sub_process],
      state: State[user.state === true ? 0 : 1]
    }

    jwt.sign(usuario, JWT_SECRECT, { expiresIn: '2h' }, (err, token) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({ message: err.message })
        return
      };

      res.status(200)
        .cookie(
          JWT_NAME_TOKEN,
          token,
          {
            httpOnly: ENTORNO === 'dev' ? false : true,
            secure: ENTORNO === 'dev' ? false : true,
            sameSite: ENTORNO === 'dev' ? 'lax' : 'none'
          }
        )
        .json({ message: 'Login successful' });
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' });
    return
  }
}

export const UserByToken = async (req: Request, res: Response) => {
  try {
    const cookie = req.headers.cookie

    if (!cookie) {
      res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
      return;
    }

    const token = cookie.split('=')[1];

    try {
      const decoded = await verifyToken(token, JWT_SECRECT);
      res.status(200).json(decoded);
      return
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Token expired' });
        return
      }
      res.status(401).json({ message: 'Unauthorized' });
      return
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  const cookie = req.headers.cookie
  const token = cookie?.split('=')[0]

  if (!token) {
    res.status(400).json({ message: 'Token not found' });
    return
  }

  try {
    res.clearCookie(token).status(200).json({ message: 'Logout successful' })
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' })
    return
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
        company: Company[user.company],
        process: Process[user.process],
        sub_process: SubProcess[user.sub_process],
        state: State[user.state === true ? 0 : 1],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

    if (users.length === 0) {
      res.status(404).json({ message: 'Users not found in database' });
      return
    }

    res.status(200).json(users);
    return
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const document = req.params.id;
    const result = await findUserServicesById(document);

    if (!result) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const user = {
      id: result.id,
      document: result.document,
      phone: result.phone,
      names: result.names,
      lastnames: result.lastNames,
      username: result.username,
      email: result.email,
      company: Company[result.company],
      process: Process[result.process],
      sub_process: SubProcess[result.sub_process],
      state: State[result.state === true ? 0 : 1],
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }


    res.status(200).json(user);
    return
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    return
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { document, email } = req.body;

  if (!document || !email) {
    res.status(400).json({ message: 'documento y correo son requeridos' });
    return
  }

  try {
    const user = await forgotPasswordServices(document, email);

    if (user.dataValues.id === null) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const token = cryto.randomBytes(20).toString('hex');
    const now = new Date(); now.setMinutes(now.getMinutes() + 10);

    const result = await asignTokenServices(token, now, document);

    if (result[0] === 0) {
      res.status(500).json({ message: 'Internal server error' });
      return
    }

    const response = await SendEmailRestorePassword({ email: user.dataValues.email, token });
    console.log(response);

    res.status(200).json({ message: 'Solicitud Generada Correctamente' });
    return
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return
    }
    res.status(500).json({ message: 'Internal server error' });
    return
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body

  if (!token || !password || !confirmPassword) {
    res.status(400).json({ message: 'token y contraseñas son requeridas' })
    return
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Las contraseñas no coinciden' })
    return
  }

  try {
    const response = await resetPasswordService(token, password)

    if (response[0] === 0) {
      res.status(404).json({ message: 'Error al intentar restablecer contraseña' })
      return
    }

    res.status(200).json({ message: 'Contraseña restablecida correctamente' })
    return
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message })
      return
    }
    res.status(500).json('Internal server error')
    return
  }
}
