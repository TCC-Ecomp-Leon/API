import express from 'express';
import { CursoController } from '../controllers/CursoController';

export const router = express.Router();

const cursoController = new CursoController();

router.put(
  '/cursos/:idProjeto/:idCurso',
  cursoController.atualizarCurso.bind(cursoController)
);
router.post(
  '/cursos/:idProjeto/:idCurso/materia',
  cursoController.adicionarMateria.bind(cursoController)
);
router.post(
  '/cursos/:idProjeto',
  cursoController.registrarCurso.bind(cursoController)
);
