
const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    // Estabelecer conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
    });
    
    console.log('Conectado ao MySQL servidor');
    
    // Criar o banco de dados se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS testesvictor');
    console.log('Banco de dados testesvictor criado ou já existente');
    
    // Usar o banco de dados
    await connection.query('USE testesvictor');
    console.log('Usando o banco de dados testesvictor');
    
    // Criar tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'employee') NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabela users criada');
    
    // Criar tabela de registros de ponto
    await connection.query(`
      CREATE TABLE IF NOT EXISTS time_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        entrada DATETIME NOT NULL,
        saida DATETIME,
        observacao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Tabela time_entries criada');
    
    // Criar tabela de solicitações de edição de ponto
    await connection.query(`
      CREATE TABLE IF NOT EXISTS edit_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ponto_id INT NOT NULL,
        user_id INT NOT NULL,
        nova_entrada DATETIME NOT NULL,
        nova_saida DATETIME NOT NULL,
        observacao_motivo TEXT NOT NULL,
        aprovado BOOLEAN,
        aprovado_por INT,
        data_aprovacao DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ponto_id) REFERENCES time_entries(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (aprovado_por) REFERENCES users(id)
      )
    `);
    console.log('Tabela edit_requests criada');
    
    console.log('Estrutura do banco de dados criada com sucesso!');
    
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexão fechada');
    }
  }
}

// Executar a função de configuração
setupDatabase();
