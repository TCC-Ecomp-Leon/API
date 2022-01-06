import express from 'express';
import { BancoDeQuestoesController } from '../controllers/BancoDeQuestoes';

export const router = express.Router();

const bancoDeQuestoesController = new BancoDeQuestoesController();

const baseUrl = '/banco-questoes';

router.get(
  baseUrl + '/:idProjeto',
  bancoDeQuestoesController.listarQuestoes.bind(bancoDeQuestoesController)
);
router.delete(
  baseUrl + '/:idQuestao',
  bancoDeQuestoesController.removerQuestao.bind(bancoDeQuestoesController)
);
