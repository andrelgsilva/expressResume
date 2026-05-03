const express = require('express');
const router = express.Router();

const {
  criarIdioma,
  listarIdiomas,
  buscarIdioma,
  atualizarIdioma,
  deletarIdioma
} = require('../controllers/idiomaController');


//  ROTAS
router.post('/', criarIdioma);
router.get('/', listarIdiomas);
router.get('/:id', buscarIdioma);
router.put('/:id', atualizarIdioma);
router.delete('/:id', deletarIdioma);


module.exports = router;