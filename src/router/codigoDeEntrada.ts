import express from 'express';
import { CodigoDeEntradaController } from '../controllers/CodigoDeEntradaController';

export const router = express.Router();

const codigoDeEntradaController = new CodigoDeEntradaController();

router.get(
  '/codigoDeEntrada',
  codigoDeEntradaController.getCodigos.bind(codigoDeEntradaController)
);
router.post(
  '/codigoDeEntrada',
  codigoDeEntradaController.criarCodigo.bind(codigoDeEntradaController)
);
router.delete(
  '/codigoDeEntrada/:id',
  codigoDeEntradaController.deletarCodigo.bind(codigoDeEntradaController)
);
