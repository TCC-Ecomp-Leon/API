import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { criarAtividadeNavigation } from '../navigations/atividades/criarAtividade';
import { listarAtividadesNavigation } from '../navigations/atividades/listarAtividades';
import { removerAtividadeNavigation } from '../navigations/atividades/removerAtividade';

export class AtividadeController extends Controller {
  criarAtividade(req: Request, res: Response) {
    this.runNavigation(criarAtividadeNavigation, req, res);
  }

  listarAtividades(req: Request, res: Response) {
    this.runNavigation(listarAtividadesNavigation, req, res);
  }

  removerAtividade(req: Request, res: Response) {
    this.runNavigation(removerAtividadeNavigation, req, res);
  }
}
