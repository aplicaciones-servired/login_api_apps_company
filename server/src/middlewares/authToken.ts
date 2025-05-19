import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/verifyToken';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../model/user.model';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

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
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return 
    }
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return 
  }
};