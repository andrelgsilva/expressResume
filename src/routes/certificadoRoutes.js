const express = require('express');
const router = express.Router();

const {
  criarCertificado,
  listarCertificados,
  buscarCertificado,
  atualizarCertificado,
  deletarCertificado
} = require('../controllers/certificadoController');


//  ROTAS
router.post('/', criarCertificado);
router.get('/', listarCertificados);
router.get('/:id', buscarCertificado);
router.put('/:id', atualizarCertificado);
router.delete('/:id', deletarCertificado);


module.exports = router;