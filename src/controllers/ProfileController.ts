import { dummyGetNavigation } from '../navigations/dummy/dummyGetNavigation';
import Controller from '../structure/controller';
import { Express, Request, Response } from 'express';
import { getUserProfileNavigation } from '../navigations/profile/getUserProfile';
import { getProfileNavigation } from '../navigations/profile/getProfile';
import { updateProfileNavigation } from '../navigations/profile/updateProfile';
import { deleteProfileNavitation } from '../navigations/profile/deleteProfile';

export class ProfileController extends Controller {
  getUserProfile(req: Request, res: Response) {
    this.runNavigation(getUserProfileNavigation, req, res);
  }
  getProfile(req: Request, res: Response) {
    this.runNavigation(getProfileNavigation, req, res);
  }

  updateProfile(req: Request, res: Response) {
    this.runNavigation(updateProfileNavigation, req, res);
  }

  deleteProfile(req: Request, res: Response) {
    this.runNavigation(deleteProfileNavitation, req, res);
  }
}
