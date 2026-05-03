const { pool } = require('../config/db');


// CREATE
const criarCertificado = async (req, res) => {
  try {
    const { nome, instituicao, data, link, usuario_id } = req.body;

    if (!nome || !usuario_id) {
      return res.status(400).json({ error: 'nome e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO certificado (nome, instituicao, data, link, usuario_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [nome, instituicao, data, link, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar certificado' });
  }
};


// READ (todos)
const listarCertificados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM certificado c
      JOIN usuario u ON u.id = c.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar certificados' });
  }
};

// READ (por id)
const buscarCertificado = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM certificado c
      JOIN usuario u ON u.id = c.usuario_id
      WHERE c.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado nao encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar certificado' });
  }
};


// UPDATE
const atualizarCertificado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, instituicao, data, link } = req.body;

    const atual = await pool.query('SELECT * FROM certificado WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado nao encontrado' });
    }

    const novoNome = nome ?? atual.rows[0].nome;
    const novaInstituicao = instituicao ?? atual.rows[0].instituicao;
    const novaData = data ?? atual.rows[0].data;
    const novoLink = link ?? atual.rows[0].link;

    const result = await pool.query(
      'UPDATE certificado SET nome=$1, instituicao=$2, data=$3, link=$4 WHERE id=$5 RETURNING *',
      [novoNome, novaInstituicao, novaData, novoLink, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar certificado' });
  }
};


// DELETE
const deletarCertificado = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM certificado WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado não encontrado' });
    }

    res.json({ message: 'Certificado deletado' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar certificado' });
  }
};


module.exports = {
  criarCertificado,
  listarCertificados,
  buscarCertificado,
  atualizarCertificado,
  deletarCertificado
};