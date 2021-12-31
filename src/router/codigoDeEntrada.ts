import express from 'express';
import { CodigoDeEntradaController } from '../controllers/CodigoDeEntradaController';

export const router = express.Router();

const codigoDeEntradaController = new CodigoDeEntradaController();

router.delete(
  '/codigoDeEntrada/:id',
  codigoDeEntradaController.deletarCodigo.bind(codigoDeEntradaController)
);
router.put(
  '/codigoDeEntrada/:id',
  codigoDeEntradaController.usarCodigo.bind(codigoDeEntradaController)
);
router.get(
  '/codigoDeEntrada',
  codigoDeEntradaController.getCodigos.bind(codigoDeEntradaController)
);
router.post(
  '/codigoDeEntrada',
  codigoDeEntradaController.criarCodigo.bind(codigoDeEntradaController)
);
