const { pool } = require('../config/db');


// CREATE
const criarIdioma = async (req, res) => {
  try {
    const { nome, nivel, usuario_id } = req.body;

    if (!nome || !usuario_id) {
      return res.status(400).json({ error: 'nome e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO idioma (nome, nivel, usuario_id) VALUES ($1,$2,$3) RETURNING *',
      [nome, nivel, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar idioma' });
  }
};


// READ (todos)
const listarIdiomas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM idioma i
      JOIN usuario u ON u.id = i.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar idiomas' });
  }
};

// READ (por id)
const buscarIdioma = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT i.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM idioma i
      JOIN usuario u ON u.id = i.usuario_id
      WHERE i.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idioma nao encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar idioma' });
  }
};


// UPDATE
const atualizarIdioma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, nivel } = req.body;

    const atual = await pool.query('SELECT * FROM idioma WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Idioma nao encontrado' });
    }

    const novoNome = nome ?? atual.rows[0].nome;
    const novoNivel = nivel ?? atual.rows[0].nivel;

    const result = await pool.query(
      'UPDATE idioma SET nome=$1, nivel=$2 WHERE id=$3 RETURNING *',
      [novoNome, novoNivel, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar idioma' });
  }
};


// DELETE
const deletarIdioma = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM idioma WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idioma não encontrado' });
    }

    res.json({ message: 'Idioma deletado' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar idioma' });
  }
};


module.exports = {
  criarIdioma,
  listarIdiomas,
  buscarIdioma,
  atualizarIdioma,
  deletarIdioma
};