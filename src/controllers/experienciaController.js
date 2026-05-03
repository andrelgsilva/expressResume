const { pool } = require('../config/db');


// CREATE
const criarExperiencia = async (req, res) => {
  try {
    const { cargo, empresa, data_inicio, data_fim, descricao, usuario_id } = req.body;

    if (!cargo || !empresa || !data_inicio || !usuario_id) {
      return res.status(400).json({ error: 'cargo, empresa, data_inicio e usuario_id são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO experiencia (cargo, empresa, data_inicio, data_fim, descricao, usuario_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [cargo, empresa, data_inicio, data_fim, descricao, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar experiência' });
  }
};


// READ (todos)
const listarExperiencias = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM experiencia e
      JOIN usuario u ON u.id = e.usuario_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar experiencias' });
  }
};

// READ (por id)
const buscarExperiencia = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT e.*, u.nome AS usuario_nome, u.email AS usuario_email
      FROM experiencia e
      JOIN usuario u ON u.id = e.usuario_id
      WHERE e.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experiencia nao encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar experiencia' });
  }
};


// UPDATE
const atualizarExperiencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { cargo, empresa, data_inicio, data_fim, descricao } = req.body;

    const atual = await pool.query('SELECT * FROM experiencia WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Experiencia nao encontrada' });
    }

    const novoCargo = cargo ?? atual.rows[0].cargo;
    const novaEmpresa = empresa ?? atual.rows[0].empresa;
    const novaDataInicio = data_inicio ?? atual.rows[0].data_inicio;
    const novaDataFim = data_fim ?? atual.rows[0].data_fim;
    const novaDescricao = descricao ?? atual.rows[0].descricao;

    const result = await pool.query(
      'UPDATE experiencia SET cargo=$1, empresa=$2, data_inicio=$3, data_fim=$4, descricao=$5 WHERE id=$6 RETURNING *',
      [novoCargo, novaEmpresa, novaDataInicio, novaDataFim, novaDescricao, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar experiencia' });
  }
};


// DELETE
const deletarExperiencia = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM experiencia WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experiência não encontrada' });
    }

    res.json({ message: 'Experiência deletada' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar experiência' });
  }
};


module.exports = {
  criarExperiencia,
  listarExperiencias,
  buscarExperiencia,
  atualizarExperiencia,
  deletarExperiencia
};