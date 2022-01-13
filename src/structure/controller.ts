import { Request, Response } from 'express';
import Context from './context';
import Navigation from './navigation';

export default class Controller {
  async runNavigation(navigation: Navigation, req: Request, res: Response) {
    const context: Context = new Context(req);
    console.log(context.method);
    console.log(context.url);
    console.log(context.body);

    const handlersResponse = await navigation.navigate(context);
    if (handlersResponse.success) {
      console.log(handlersResponse.body);
      res.status(handlersResponse.status).send(handlersResponse.body);
    } else {
      console.warn('ERROR');
      console.warn(handlersResponse.error);
      res.status(500).send({});
    }
  }
}
