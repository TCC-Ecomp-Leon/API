import express from 'express';
import { DuvidaController } from '../controllers/DuvidaController';

export const router = express.Router();

const duvidaController = new DuvidaController();

const baseUrl = '/duvida';

router.put(
  baseUrl + '/:id',
  duvidaController.iteragirDuvida.bind(duvidaController)
);
router.get(baseUrl, duvidaController.listaDeDuvidas.bind(duvidaController));
router.post(baseUrl, duvidaController.criarDuvida.bind(duvidaController));
