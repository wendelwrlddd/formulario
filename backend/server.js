require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
// Configuração do CORS para aceitar requisições de qualquer origem do Frontend (ou especificar a URL do Vite)
app.use(cors());
app.use(express.json());

// Verifica se a variável de ambiente existe
if (!process.env.DATABASE_URL) {
    console.error("FATAL ERROR: DATABASE_URL is not defined in the environment.");
    process.exit(1);
}

// Criação do Pool de conexões do MySQL
const pool = mysql.createPool(process.env.DATABASE_URL);

// Inicializa o banco de dados
(async () => {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                whatsapp VARCHAR(50) NOT NULL,
                has_business VARCHAR(10) NOT NULL,
                problem TEXT,
                url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Banco de dados verificado/criado com sucesso.");
    } catch (e) {
        console.error("Erro ao criar a tabela 'leads': ", e);
    }
})();

// Rota de Inserção (POST) para o formulário
app.post('/api/leads', async (req, res) => {
    try {
        const { name, whatsapp, has_business, problem, url } = req.body;
        
        // Validação simples
        if (!name || !whatsapp || !has_business) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        const query = `
            INSERT INTO leads (name, whatsapp, has_business, problem, url)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [name, whatsapp, has_business, problem || null, url || null];

        const [result] = await pool.execute(query, params);
        
        res.status(201).json({ message: 'Lead salvo com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ error: 'Erro ao salvar os dados no banco.', details: error.message });
    }
});

// Rota de Leitura (GET) para o Dashboard
app.get('/api/leads', async (req, res) => {
    try {
        const query = 'SELECT * FROM leads ORDER BY created_at DESC';
        const [rows] = await pool.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Erro ao buscar dados.', details: error.message });
    }
});

// Inicialização do servidor web
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
