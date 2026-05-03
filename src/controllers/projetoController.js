const { pool } = require('../config/db');


// CREATE
const criarProjeto = async (req, res) => {
  try {
    const { nome, descricao, usuario_id } = req.body;

    if (!nome || !usuario_id) {
      return res.status(400).json({ error: 'Nome e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
};


// READ (todos)
const listarProjetos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM projetos p
      JOIN usuario u ON u.id = p.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
};


// READ (por id) — com dados do usuário
const buscarProjeto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT p.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM projetos p
      JOIN usuario u ON u.id = p.usuario_id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
};


// UPDATE
const atualizarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const atual = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto nao encontrado' });
    }

    const novoNome = nome ?? atual.rows[0].nome;
    const novaDescricao = descricao ?? atual.rows[0].descricao;

    const result = await pool.query(
      'UPDATE projetos SET nome=$1, descricao=$2 WHERE id=$3 RETURNING *',
      [novoNome, novaDescricao, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
};


// DELETE
const deletarProjeto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM projetos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({ message: 'Projeto deletado' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar projeto' });
  }
};


// Projetos por usuário
const listarProjetosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM projetos WHERE usuario_id = $1',
      [id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos do usuário' });
  }
};


module.exports = {
  criarProjeto,
  listarProjetos,
  buscarProjeto,
  atualizarProjeto,
  deletarProjeto,
  listarProjetosPorUsuario
};