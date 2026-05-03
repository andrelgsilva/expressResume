const express = require('express');
const router = express.Router();

const {
  criarHabilidade,
  listarHabilidades,
  buscarHabilidade,
  atualizarHabilidade,
  deletarHabilidade
} = require('../controllers/habilidadeController');


//  ROTAS
router.post('/', criarHabilidade);
router.get('/', listarHabilidades);
router.get('/:id', buscarHabilidade);
router.put('/:id', atualizarHabilidade);
router.delete('/:id', deletarHabilidade);


module.exports = router;