const express = require('express');
const router = express.Router();

const {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario
} = require('../controllers/usuarioController');


//  ROTAS
router.post('/', criarUsuario);
router.get('/', listarUsuarios);
router.get('/:id', buscarUsuario);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);


module.exports = router;