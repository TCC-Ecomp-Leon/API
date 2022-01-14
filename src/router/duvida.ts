import express from 'express';
import { DuvidaController } from '../controllers/DuvidaController';

export const router = express.Router();

const duvidaController = new DuvidaController();

const baseUrl = '/duvida';

router.get(
  baseUrl + '/:id',
  duvidaController.obterDuvida.bind(duvidaController)
);
router.put(
  baseUrl + '/:id',
  duvidaController.iteragirDuvida.bind(duvidaController)
);
router.get(baseUrl, duvidaController.listaDeDuvidas.bind(duvidaController));
router.post(baseUrl, duvidaController.criarDuvida.bind(duvidaController));
