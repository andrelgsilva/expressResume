const express = require('express');
const router = express.Router();

const {
  criarContato,
  listarContatos,
  buscarContato,
  atualizarContato,
  deletarContato
} = require('../controllers/contatoController');


//  ROTAS
router.post('/', criarContato);
router.get('/', listarContatos);
router.get('/:id', buscarContato);
router.put('/:id', atualizarContato);
router.delete('/:id', deletarContato);


module.exports = router;