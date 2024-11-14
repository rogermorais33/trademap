import { Pool } from 'pg';

const pool = new Pool({
  user: 'trademapUser',
  host: 'trademap-container', // Local: localhost - container: trademap-container
  database: 'trademapDB',
  password: 'trademapPassword',
  port: 5432,
});

const testDbConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão bem-sucedida ao banco de dados!');
    console.log('Data e hora atual no banco de dados:', res.rows[0]);
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
};

testDbConnection();

export default pool;
