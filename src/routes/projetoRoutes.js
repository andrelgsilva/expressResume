const express = require('express');
const router = express.Router();

const {
  criarProjeto,
  listarProjetos,
  buscarProjeto,
  atualizarProjeto,
  deletarProjeto,
  listarProjetosPorUsuario
} = require('../controllers/projetoController');

// ROTAS
router.post('/', criarProjeto);
router.get('/', listarProjetos);
router.get('/usuario/:id', listarProjetosPorUsuario); // ← estática ANTES
router.get('/:id', buscarProjeto);                    // ← dinâmica DEPOIS
router.put('/:id', atualizarProjeto);
router.delete('/:id', deletarProjeto);

module.exports = router;