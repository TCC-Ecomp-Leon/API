import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { responderAtividadeNavigation } from '../navigations/respostaAtividade/responderAtividade';
import { lerRespostaNavigation } from '../navigations/respostaAtividade/lerResposta';
import { listarRespostasNavigation } from '../navigations/respostaAtividade/listarRespostas';
import { interagirRespostaNavigation } from '../navigations/respostaAtividade/interagirResposta';
import { lerRespostasPorPerfilNavigation } from '../navigations/respostaAtividade/lerRespostasPorPerfil';

export class RespostasAtividadesController extends Controller {
  responderAtividade(req: Request, res: Response) {
    this.runNavigation(responderAtividadeNavigation, req, res);
  }

  lerResposta(req: Request, res: Response) {
    this.runNavigation(lerRespostaNavigation, req, res);
  }

  listarRespostas(req: Request, res: Response) {
    this.runNavigation(listarRespostasNavigation, req, res);
  }

  interagirResposta(req: Request, res: Response) {
    this.runNavigation(interagirRespostaNavigation, req, res);
  }

  lerRespostasPorPerfil(req: Request, res: Response) {
    this.runNavigation(lerRespostasPorPerfilNavigation, req, res);
  }
}
