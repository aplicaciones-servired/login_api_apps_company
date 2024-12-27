import bcrypt from 'bcryptjs';
import { SALT } from '../configs/envSchema';

const USERNAME_PREFIX = 'CP';
const SALT_ROUNDS = bcrypt.genSaltSync(parseInt(SALT));
/**
 * Generate a username with document
 * @param document type number
 * @returns username with the prefix CP and the document number
 **/
export const generateUsername = (document: string | number) => {
  return `${USERNAME_PREFIX}${document}`;
};

/**
 * Generate a password with the last three digits of the document
 * @param document type number or string
 * @returns password with the prefix CP and the last three digits of the document
 **/
export const generatePassword = async (document: string | number) => {
  if (typeof document === 'number') document = document.toString();
  const threeLastDocument = document.slice(-3);
  const pass = `${USERNAME_PREFIX}${threeLastDocument}`;
  return bcrypt.hash(pass, SALT_ROUNDS);
};

export const hashNewPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};