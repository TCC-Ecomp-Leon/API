import express from 'express';
import { ProjetoController } from '../controllers/ProjetoController';

export const router = express.Router();

const projetoController = new ProjetoController();

router.get('/projeto', projetoController.getProjetos.bind(projetoController));
router.put(
  '/projeto/:id',
  projetoController.atualizarProjeto.bind(projetoController)
);
router.post(
  '/projeto/aprovacao',
  projetoController.registrarProjeto.bind(projetoController)
);
router.get(
  '/projeto/aprovacao',
  projetoController.getProjetosNaoAprovados.bind(projetoController)
);
router.put(
  '/projeto/aprovacao/:id',
  projetoController.aprovarProjeto.bind(projetoController)
);
