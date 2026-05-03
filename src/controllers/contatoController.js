const { pool } = require('../config/db');


// CREATE
const criarContato = async (req, res) => {
  try {
    const { tipo, url, usuario_id } = req.body;

    if (!tipo || !url || !usuario_id) {
      return res.status(400).json({ error: 'tipo, url e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO contato (tipo, url, usuario_id) VALUES ($1,$2,$3) RETURNING *',
      [tipo, url, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar contato' });
  }
};


// READ (todos)
const listarContatos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM contato c
      JOIN usuario u ON u.id = c.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
};

// READ (por id)
const buscarContato = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM contato c
      JOIN usuario u ON u.id = c.usuario_id
      WHERE c.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contato nao encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contato' });
  }
};


// UPDATE
// UPDATE
const atualizarContato = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, url } = req.body;

    const atual = await pool.query('SELECT * FROM contato WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Contato nao encontrado' });
    }

    const novoTipo = tipo ?? atual.rows[0].tipo;
    const novaUrl = url ?? atual.rows[0].url;

    const result = await pool.query(
      'UPDATE contato SET tipo=$1, url=$2 WHERE id=$3 RETURNING *',
      [novoTipo, novaUrl, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar contato' });
  }
};

// DELETE
const deletarContato = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM contato WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    res.json({ message: 'Contato deletado' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar contato' });
  }
};


module.exports = {
  criarContato,
  listarContatos,
  buscarContato,
  atualizarContato,
  deletarContato
};