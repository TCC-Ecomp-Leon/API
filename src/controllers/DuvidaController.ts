import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { criarDuvidaNavigation } from '../navigations/duvida/criarDuvida';
import { iteragirDuvidaNavigation } from '../navigations/duvida/iteragirDuvida';
import { listarDuvidasNavigation } from '../navigations/duvida/listarDuvidas';
import { obterDuvidaNavigation } from '../navigations/duvida/obterDuvida';

export class DuvidaController extends Controller {
  criarDuvida(req: Request, res: Response) {
    this.runNavigation(criarDuvidaNavigation, req, res);
  }

  iteragirDuvida(req: Request, res: Response) {
    this.runNavigation(iteragirDuvidaNavigation, req, res);
  }

  obterDuvida(req: Request, res: Response) {
    this.runNavigation(obterDuvidaNavigation, req, res);
  }

  listaDeDuvidas(req: Request, res: Response) {
    this.runNavigation(listarDuvidasNavigation, req, res);
  }
}
