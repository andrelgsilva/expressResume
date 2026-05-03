const { pool } = require('../config/db');


// CREATE
const criarHabilidade = async (req, res) => {
  try {
    const { nome, nivel, usuario_id } = req.body;

    if (!nome || !usuario_id) {
      return res.status(400).json({ error: 'nome e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO habilidade (nome, nivel, usuario_id) VALUES ($1,$2,$3) RETURNING *',
      [nome, nivel, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar habilidade' });
  }
};


// READ (todos)
const listarHabilidades = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM habilidade h
      JOIN usuario u ON u.id = h.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar habilidades' });
  }
};

// READ (por id)
const buscarHabilidade = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT h.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM habilidade h
      JOIN usuario u ON u.id = h.usuario_id
      WHERE h.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habilidade nao encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar habilidade' });
  }
};

// UPDATE
const atualizarHabilidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, nivel } = req.body;

    const atual = await pool.query('SELECT * FROM habilidade WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Habilidade nao encontrada' });
    }

    const novoNome = nome ?? atual.rows[0].nome;
    const novoNivel = nivel ?? atual.rows[0].nivel;

    const result = await pool.query(
      'UPDATE habilidade SET nome=$1, nivel=$2 WHERE id=$3 RETURNING *',
      [novoNome, novoNivel, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar habilidade' });
  }
};


// DELETE
const deletarHabilidade = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM habilidade WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habilidade não encontrada' });
    }

    res.json({ message: 'Habilidade deletada' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar habilidade' });
  }
};


module.exports = {
  criarHabilidade,
  listarHabilidades,
  buscarHabilidade,
  atualizarHabilidade,
  deletarHabilidade
};