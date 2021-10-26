import { Request, Response } from 'express';
import Context from './context';
import Navigation from './navigation';

export default class Controller {
  async runNavigation(navigation: Navigation, req: Request, res: Response) {
    const context: Context = new Context(req);

    const handlersResponse = await navigation.navigate(context);
    if (handlersResponse.success) {
      res.status(handlersResponse.status).send(handlersResponse.body);
    } else {
      console.warn('ERROR');
      console.warn(handlersResponse.error.message);
      res.status(500).send({});
    }
  }
}
