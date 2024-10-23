import { login_unif } from './connections/login_unificado';

export const { 
  PORT = 3000,
} = process.env;


export default async function testConnection() {
  try {
    await login_unif.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}