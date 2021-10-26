import express from 'express';
import { AuthController } from '../controllers/AuthController';

export const router = express.Router();

const authController = new AuthController();

router.post('/auth/sign-in', authController.signIn.bind(authController));
router.get('/auth/sign-up', authController.signUp.bind(authController));
