import express from 'express';
import { CursoUniversitarioController } from '../controllers/CursoUniversitarioController';

export const router = express.Router();

const cursoUniversitarioController = new CursoUniversitarioController();

const baseUrl = '/curso-universitario';

router.put(
  baseUrl + '/:id',
  cursoUniversitarioController.atualizacaoCursoUniversitario.bind(
    cursoUniversitarioController
  )
);
router.delete(
  baseUrl + '/:id',
  cursoUniversitarioController.removerCursoUniversitario.bind(
    cursoUniversitarioController
  )
);
router.get(
  baseUrl,
  cursoUniversitarioController.getCursosUniversitarios.bind(
    cursoUniversitarioController
  )
);
router.post(
  baseUrl,
  cursoUniversitarioController.adicaoCursoUniversitario.bind(
    cursoUniversitarioController
  )
);
