require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTable() {
    try {
        if (!process.env.DATABASE_URL) {
            console.error("ERRO: DATABASE_URL não definida em .env");
            process.exit(1);
        }
        
        console.log("Conectando ao banco de dados Railway...");
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        
        console.log("Executando CREATE TABLE if not exists...");
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                whatsapp VARCHAR(50) NOT NULL,
                has_business VARCHAR(10) NOT NULL,
                problem TEXT,
                url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await connection.execute(createTableQuery);

        console.log("Tabela 'leads' verificada e criada com sucesso!");
        
        await connection.end();
    } catch (e) {
        console.error("Falha ao criar tabela: ", e);
    }
}

createTable();
