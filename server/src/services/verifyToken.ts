import { JWT_SECRECT } from '../configs/envSchema';
import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRECT, (err, decoded) => {
			if (err) return reject(err);
			resolve(decoded as User);
		});
	});
};