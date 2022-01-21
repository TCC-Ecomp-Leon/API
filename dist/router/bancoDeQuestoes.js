"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const BancoDeQuestoes_1 = require("../controllers/BancoDeQuestoes");
exports.router = express_1.default.Router();
const bancoDeQuestoesController = new BancoDeQuestoes_1.BancoDeQuestoesController();
const baseUrl = '/banco-questoes';
exports.router.get(baseUrl + '/:idProjeto', bancoDeQuestoesController.listarQuestoes.bind(bancoDeQuestoesController));
exports.router.delete(baseUrl + '/:idQuestao', bancoDeQuestoesController.removerQuestao.bind(bancoDeQuestoesController));
//# sourceMappingURL=bancoDeQuestoes.js.map