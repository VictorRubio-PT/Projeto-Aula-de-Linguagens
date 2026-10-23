const { Router } = require('express');
const router = Router();

const db = require('../database/db');

router.get('/', (req, res) => {
    try {
        const vagas = db.prepare(`
            SELECT v.*, e.nome AS empresa_nome
            FROM vagas v
            JOIN empresas e ON v.empresa_id = e.id
            ORDER BY v.created_at DESC
        `).all();
        res.json(vagas);
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).json({ error: 'Erro interno ao buscar vagas' });
    }
});

router.post('/', (req, res) => {
    const { titulo, empresa_id, tipo, tecnologias, salario, cep, cidade, estado, descricao } = req.body;

    if(!titulo || !empresa_id || !tipo || !tecnologias || !salario || !cep || !cidade || !estado || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = db.prepare(`
        INSERT INTO vagas (titulo, empresa_id, tipo, tecnologias, salario, cep, cidade, estado, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(titulo, empresa_id, tipo, tecnologias.join(', '), salario, cep, cidade, estado, descricao);
    const novaVaga = db.prepare('SELECT * FROM vagas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Vaga criada com sucesso' });

});
module.exports = router;