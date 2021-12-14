import express from 'express';
import { AuthController } from '../controllers/AuthController';

export const router = express.Router();

const authController = new AuthController();

router.put('/auth/sign', authController.signIn.bind(authController));
router.post('/auth/sign', authController.signUp.bind(authController));
