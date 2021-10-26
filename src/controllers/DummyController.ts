import { dummyGetNavigation } from '../navigations/dummy/dummyGetNavigation';
import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';

export class DummyController extends Controller {
  dummyGet(req: Request, res: Response) {
    this.runNavigation(dummyGetNavigation, req, res);
  }
}
