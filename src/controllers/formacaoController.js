const { pool } = require('../config/db');


// CREATE
const criarFormacao = async (req, res) => {
  try {
    const { instituicao, curso, nivel, data_inicio, data_fim, usuario_id } = req.body;

    if (!instituicao || !curso || !data_inicio || !usuario_id) {
      return res.status(400).json({ error: 'instituicao, curso, data_inicio e usuario_id sao obrigatorios' });
    }

    const result = await pool.query(
      'INSERT INTO formacao (instituicao, curso, nivel, data_inicio, data_fim, usuario_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [instituicao, curso, nivel, data_inicio, data_fim, usuario_id]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar formacao' });
  }
};


// READ (todos)
const listarFormacoes = async (req, res) => {
  try {
    const result = await pool.query('SELECT f.*, u.nome AS usuario_nome FROM formacao f JOIN usuario u ON u.id = f.usuario_id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formacoes' });
  }
};


// READ (por id)
const buscarFormacao = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM formacao WHERE id = $1', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formacao nao encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formacao' });
  }
};


// UPDATE
const atualizarFormacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { instituicao, curso, nivel, data_inicio, data_fim } = req.body;

    const atual = await pool.query('SELECT * FROM formacao WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Formacao nao encontrada' });
    }

    const novaInstituicao = instituicao ?? atual.rows[0].instituicao;
    const novoCurso = curso ?? atual.rows[0].curso;
    const novoNivel = nivel ?? atual.rows[0].nivel;
    const novaDataInicio = data_inicio ?? atual.rows[0].data_inicio;
    const novaDataFim = data_fim ?? atual.rows[0].data_fim;

    const result = await pool.query(
      'UPDATE formacao SET instituicao=$1, curso=$2, nivel=$3, data_inicio=$4, data_fim=$5 WHERE id=$6 RETURNING *',
      [novaInstituicao, novoCurso, novoNivel, novaDataInicio, novaDataFim, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar formacao' });
  }
};


// DELETE
const deletarFormacao = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM formacao WHERE id = $1 RETURNING *', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Formacao nao encontrada' });
    }

    res.json({ message: 'Formacao deletada' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar formacao' });
  }
};


module.exports = {
  criarFormacao,
  listarFormacoes,
  buscarFormacao,
  atualizarFormacao,
  deletarFormacao
};