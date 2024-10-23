import { Sequelize } from 'sequelize';

const DB_NAME = process.env.DB_NAME as string
const DB_USER = process.env.DB_USER as string
const DB_PASS = process.env.DB_PASS as string
const DB_HOST = process.env.DB_HOST as string
const DB_PORT = parseInt(process.env.DB_PORT as string)
const DB_DIALECT = process.env.DB_DIALECT as string

const login_unif = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port : DB_PORT,
  dialect: DB_DIALECT === 'true' ? 'mysql' : 'mariadb',
  timezone: '-05:00',
});

export { login_unif };