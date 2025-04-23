import { Request, Response, NextFunction } from 'express';
import { JWT_SECRECT } from '../configs/envSchema';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.headers.cookie 

  if (!cookie) {
    res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    return;
  }
  const token = cookie.split('=')[1];

  try {
    jwt.verify(token, JWT_SECRECT);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};