import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { signInNavigation } from '../navigations/auth/signInNavigation';
import { signUpNavigation } from '../navigations/auth/signUpNavigation';
import { changeEmailAndPasswordNavigation } from '../navigations/auth/changeEmailAndPassword';
import { resetPasswordNavigation } from '../navigations/auth/resetPassword';

export class AuthController extends Controller {
  signIn(req: Request, res: Response) {
    this.runNavigation(signInNavigation, req, res);
  }

  signUp(req: Request, res: Response) {
    this.runNavigation(signUpNavigation, req, res);
  }

  resetPassword(req: Request, res: Response) {
    this.runNavigation(resetPasswordNavigation, req, res);
  }

  changeEmailAndPassword(req: Request, res: Response) {
    this.runNavigation(changeEmailAndPasswordNavigation, req, res);
  }
}
