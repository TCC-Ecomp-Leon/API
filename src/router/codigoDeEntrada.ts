import express from 'express';
import { CodigoDeEntradaController } from '../controllers/CodigoDeEntradaController';

export const router = express.Router();

const codigoDeEntradaController = new CodigoDeEntradaController();

router.delete(
  '/codigo-de-entrada/:id',
  codigoDeEntradaController.deletarCodigo.bind(codigoDeEntradaController)
);
router.put(
  '/codigo-de-entrada/:id',
  codigoDeEntradaController.usarCodigo.bind(codigoDeEntradaController)
);
router.get(
  '/codigo-de-entrada',
  codigoDeEntradaController.getCodigos.bind(codigoDeEntradaController)
);
router.post(
  '/codigo-de-entrada',
  codigoDeEntradaController.criarCodigo.bind(codigoDeEntradaController)
);
