import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { signInNavigation } from '../navigations/auth/signInNavigation';
import { signUpNavigation } from '../navigations/auth/signUpNavigation';

export class AuthController extends Controller {
  signIn(req: Request, res: Response) {
    this.runNavigation(signInNavigation, req, res);
  }

  signUp(req: Request, res: Response) {
    this.runNavigation(signUpNavigation, req, res);
  }
}
