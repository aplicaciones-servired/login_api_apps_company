import { Request, Response, NextFunction } from 'express';
import { JWT_SECRECT } from '../configs/envSchema';
import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const verifyToken = (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRECT, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as User);
    });
  });
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers.cookie 

  if (!cookie) {
    res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    return;
  }
  
  try {
    const user = await verifyToken(cookie.split('=')[1])
    req.user = user
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return 
    }
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return 
  }
};