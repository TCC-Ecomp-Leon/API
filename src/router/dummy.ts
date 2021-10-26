import express from 'express';
import { DummyController } from '../controllers/DummyController';

export const router = express.Router();

const dummyController = new DummyController();

router.get('/dummy', dummyController.dummyGet.bind(dummyController));
