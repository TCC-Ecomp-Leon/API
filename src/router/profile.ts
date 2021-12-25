import express from 'express';
import { ProfileController } from '../controllers/ProfileController';

export const router = express.Router();

const profileController = new ProfileController();

router.get(
  '/profile',
  profileController.getUserProfile.bind(profileController)
);
router.get(
  '/profile/:id',
  profileController.getProfile.bind(profileController)
);
router.put('/profile', profileController.updateProfile.bind(profileController));
router.delete(
  '/profile',
  profileController.deleteProfile.bind(profileController)
);
