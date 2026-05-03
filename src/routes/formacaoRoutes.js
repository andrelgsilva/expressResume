const express = require('express');
const router = express.Router();

const {
  criarFormacao,
  listarFormacoes,
  buscarFormacao,
  atualizarFormacao,
  deletarFormacao
} = require('../controllers/formacaoController');


//  ROTAS
router.post('/', criarFormacao);
router.get('/', listarFormacoes);
router.get('/:id', buscarFormacao);
router.put('/:id', atualizarFormacao);
router.delete('/:id', deletarFormacao);


module.exports = router;
