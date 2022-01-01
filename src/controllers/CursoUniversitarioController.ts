import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { adicaoCursoUniversitarioNavigation } from '../navigations/cursoUniversitario/adicaoCursoUniversitario';
import { atualizacaoCursoUniversitarioNavigation } from '../navigations/cursoUniversitario/atualizacaoCursoUniversitario';
import { getCursosUniversitariosNavigation } from '../navigations/cursoUniversitario/getCursosUniversitarios';

export class CursoUniversitarioController extends Controller {
  adicaoCursoUniversitario(req: Request, res: Response) {
    this.runNavigation(adicaoCursoUniversitarioNavigation, req, res);
  }

  atualizacaoCursoUniversitario(req: Request, res: Response) {
    this.runNavigation(atualizacaoCursoUniversitarioNavigation, req, res);
  }

  getCursosUniversitarios(req: Request, res: Response) {
    this.runNavigation(getCursosUniversitariosNavigation, req, res);
  }
}
