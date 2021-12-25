import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { getCodigosNavigation } from '../navigations/codigoDeEntrada/getCodigos';
import { criarCodigoNavigation } from '../navigations/codigoDeEntrada/criarCodigo';
import { deletarCodigoNavigation } from '../navigations/codigoDeEntrada/deletarCodigo';

export class CodigoDeEntradaController extends Controller {
  getCodigos(req: Request, res: Response) {
    this.runNavigation(getCodigosNavigation, req, res);
  }

  criarCodigo(req: Request, res: Response) {
    this.runNavigation(criarCodigoNavigation, req, res);
  }

  deletarCodigo(req: Request, res: Response) {
    this.runNavigation(deletarCodigoNavigation, req, res);
  }
}
