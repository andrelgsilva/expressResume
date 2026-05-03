const express = require('express');
const router = express.Router();

const {
  criarExperiencia,
  listarExperiencias,
  buscarExperiencia,
  atualizarExperiencia,
  deletarExperiencia
} = require('../controllers/experienciaController');


//  ROTAS
router.post('/', criarExperiencia);
router.get('/', listarExperiencias);
router.get('/:id', buscarExperiencia);
router.put('/:id', atualizarExperiencia);
router.delete('/:id', deletarExperiencia);


module.exports = router;