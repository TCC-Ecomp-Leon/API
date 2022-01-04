import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { listarQuestoesBancoDeQuestoesNavigation } from '../navigations/bancoDeQuestoes.ts/listarQuestoes';
import { removerQuestaoBancoDeQuestoesNavigation } from '../navigations/bancoDeQuestoes.ts/removerQuestao';

export class BancoDeQuestoesController extends Controller {
  listarQuestoes(req: Request, res: Response) {
    this.runNavigation(listarQuestoesBancoDeQuestoesNavigation, req, res);
  }

  removerQuestao(req: Request, res: Response) {
    this.runNavigation(removerQuestaoBancoDeQuestoesNavigation, req, res);
  }
}
