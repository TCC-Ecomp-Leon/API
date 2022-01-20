import express from 'express';
import { AtividadeController } from '../controllers/AtividadeController';
import { CursoUniversitarioController } from '../controllers/CursoUniversitarioController';

export const router = express.Router();

const atividadeController = new AtividadeController();

const baseUrl = '/atividade';

router.get(
  baseUrl + '/unica/:idAtividade',
  atividadeController.obterAtividade.bind(atividadeController)
);
router.delete(
  baseUrl + '/:id',
  atividadeController.removerAtividade.bind(atividadeController)
);
router.post(
  baseUrl,
  atividadeController.criarAtividade.bind(atividadeController)
);
router.get(
  baseUrl + '/:idCurso',
  atividadeController.listarAtividades.bind(atividadeController)
);
