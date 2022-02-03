import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { registrarProjetoNavigation } from '../navigations/projeto/registrarProjeto';
import { aprovarProjetoNavigation } from '../navigations/projeto/aprovarProjeto';
import { getProjetosNaoAprovadosNavigation } from '../navigations/projeto/getProjetosNaoAprovados';
import { getProjetosNavigation } from '../navigations/projeto/getProjetos';
import { atualizarProjetoNavigation } from '../navigations/projeto/atualizarProjeto';
import { getProjetoNavigation } from '../navigations/projeto/getProjeto';
export class ProjetoController extends Controller {
  registrarProjeto(req: Request, res: Response) {
    this.runNavigation(registrarProjetoNavigation, req, res);
  }

  aprovarProjeto(req: Request, res: Response) {
    this.runNavigation(aprovarProjetoNavigation, req, res);
  }

  getProjetosNaoAprovados(req: Request, res: Response) {
    this.runNavigation(getProjetosNaoAprovadosNavigation, req, res);
  }

  getProjetos(req: Request, res: Response) {
    this.runNavigation(getProjetosNavigation, req, res);
  }

  getProjeto(req: Request, res: Response) {
    this.runNavigation(getProjetoNavigation, req, res);
  }

  atualizarProjeto(req: Request, res: Response) {
    this.runNavigation(atualizarProjetoNavigation, req, res);
  }
}
