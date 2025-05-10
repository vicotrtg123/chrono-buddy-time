
import mariadb from 'mariadb';

// Pool de conexão para MariaDB
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'testesvictor',
  connectionLimit: 5
});

// Função para obter uma conexão do pool
export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
};

// Função para executar queries
export const executeQuery = async (query: string, params: any[] = []) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.query(query, params);
    return result;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
