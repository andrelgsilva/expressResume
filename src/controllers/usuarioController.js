const { pool } = require('../config/db');
console.log('pool:', pool); 



// CREATE
const criarUsuario = async (req, res) => {
  try {
    const { nome, email, idade } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const result = await pool.query(
      'INSERT INTO usuario (nome, email, idade) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, idade]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// READ (todos)
const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};


// READ (por id)
const buscarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioResult = await pool.query(
      'SELECT * FROM usuario WHERE id = $1', [id]
    );

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const [projetos, experiencias, formacoes, habilidades, certificados, contatos, idiomas] = await Promise.all([
      pool.query('SELECT * FROM projetos WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM experiencia WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM formacao WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM habilidade WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM certificado WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM contato WHERE usuario_id = $1', [id]),
      pool.query('SELECT * FROM idioma WHERE usuario_id = $1', [id]),
    ]);

    const usuario = usuarioResult.rows[0];
    usuario.projetos = projetos.rows;
    usuario.experiencias = experiencias.rows;
    usuario.formacoes = formacoes.rows;
    usuario.habilidades = habilidades.rows;
    usuario.certificados = certificados.rows;
    usuario.contatos = contatos.rows;
    usuario.idiomas = idiomas.rows;

    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
};


// UPDATE
// UPDATE
const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, idade } = req.body;

    const atual = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
    if (atual.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const novoNome = nome ?? atual.rows[0].nome;
    const novoEmail = email ?? atual.rows[0].email;
    const novaIdade = idade ?? atual.rows[0].idade;

    const result = await pool.query(
      'UPDATE usuario SET nome=$1, email=$2, idade=$3 WHERE id=$4 RETURNING *',
      [novoNome, novoEmail, novaIdade, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuario' });
  }
};


// DELETE
const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM usuario WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};


module.exports = {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario
};