import { DB_NAME, DB_PASS, DB_HOST, DB_PORT, DB_USER } from '../configs/envSchema';
import { Connection, createPool } from 'mysql2/promise';

export async function connectionPool() {
	let connection: Connection;

	try {
		const pool = createPool({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			port: parseInt(DB_PORT),
			connectionLimit: 10, // Limite de conexiones en el pool
			waitForConnections: true, // Esperar si no hay conexiones disponibles
			queueLimit: 0, // Sin limite de espera
		});
		connection = await pool.getConnection();
		return connection;
	} catch (error) {
		console.error('Error al conectar a la base de datos:', error);
		throw error;
	}
}
