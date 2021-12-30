import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { registrarCursoNavigation } from '../navigations/curso/registrarCurso';
import { atualizarCursoNavigation } from '../navigations/curso/atualizarCurso';

export class CursoController extends Controller {
  registrarCurso(req: Request, res: Response) {
    this.runNavigation(registrarCursoNavigation, req, res);
  }

  atualizarCurso(req: Request, res: Response) {
    this.runNavigation(atualizarCursoNavigation, req, res);
  }
}
