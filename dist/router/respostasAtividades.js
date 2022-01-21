"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const RespostasAtividadesController_1 = require("../controllers/RespostasAtividadesController");
exports.router = express_1.default.Router();
const respostasAtividadesController = new RespostasAtividadesController_1.RespostasAtividadesController();
const baseUrl = '/resposta-atividade';
exports.router.get(baseUrl + '/:idPerfil' + '/:idAtividade', respostasAtividadesController.lerRespostasPorPerfil.bind(respostasAtividadesController));
exports.router.post(baseUrl + '/:idAtividade', respostasAtividadesController.responderAtividade.bind(respostasAtividadesController));
exports.router.put(baseUrl + '/:idResposta', respostasAtividadesController.interagirResposta.bind(respostasAtividadesController));
exports.router.get(baseUrl + '/:idResposta', respostasAtividadesController.lerResposta.bind(respostasAtividadesController));
exports.router.get(baseUrl, respostasAtividadesController.listarRespostas.bind(respostasAtividadesController));
//# sourceMappingURL=respostasAtividades.js.map