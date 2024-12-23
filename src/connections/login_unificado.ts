import { DB_NAME, DB_PASS, DB_HOST, DB_PORT, DB_USER } from '../configs/envSchema';
import { Sequelize } from 'sequelize';

const login_unif = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: parseInt(DB_PORT),
  dialect: 'mysql',
  timezone: '-05:00',
});

export { login_unif };