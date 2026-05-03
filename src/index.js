require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const experienciaRoutes = require('./routes/experienciaRoutes');
const formacaoRoutes = require('./routes/formacaoRoutes');
const habilidadeRoutes = require('./routes/habilidadeRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const idiomaRoutes = require('./routes/idiomaRoutes');

const app = express();
app.use(cors()); // ← adiciona isso
app.use(express.json());

// ROTA TESTE
app.get('/teste', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro no banco' });
  }
});

console.log('usuarioRoutes:', typeof usuarioRoutes);
console.log('projetoRoutes:', typeof projetoRoutes);
console.log('experienciaRoutes:', typeof experienciaRoutes);
console.log('formacaoRoutes:', typeof formacaoRoutes);
console.log('habilidadeRoutes:', typeof habilidadeRoutes);
console.log('certificadoRoutes:', typeof certificadoRoutes);
console.log('contatoRoutes:', typeof contatoRoutes);
console.log('idiomaRoutes:', typeof idiomaRoutes);

// ROTAS PRINCIPAIS
app.use('/usuarios', usuarioRoutes);
app.use('/projetos', projetoRoutes);
app.use('/experiencias', experienciaRoutes);
app.use('/formacoes', formacaoRoutes);
app.use('/habilidades', habilidadeRoutes);
app.use('/certificados', certificadoRoutes);
app.use('/contatos', contatoRoutes);
app.use('/idiomas', idiomaRoutes);

// ROTA NÃO ENCONTRADA
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});