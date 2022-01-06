import express from 'express';
import { RespostasAtividadesController } from '../controllers/RespostasAtividadesController';

export const router = express.Router();

const respostasAtividadesController = new RespostasAtividadesController();

const baseUrl = '/resposta-atividade';

router.post(
  baseUrl + '/:idAtividade',
  respostasAtividadesController.responderAtividade.bind(
    respostasAtividadesController
  )
);
router.put(
  baseUrl + '/:idResposta',
  respostasAtividadesController.interagirResposta.bind(
    respostasAtividadesController
  )
);
router.get(
  baseUrl + '/:idResposta',
  respostasAtividadesController.lerResposta.bind(respostasAtividadesController)
);
router.get(
  baseUrl,
  respostasAtividadesController.listarRespostas.bind(
    respostasAtividadesController
  )
);
