"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const AtividadeController_1 = require("../controllers/AtividadeController");
exports.router = express_1.default.Router();
const atividadeController = new AtividadeController_1.AtividadeController();
const baseUrl = '/atividade';
exports.router.get(baseUrl + '/unica/:idAtividade', atividadeController.obterAtividade.bind(atividadeController));
exports.router.delete(baseUrl + '/:id', atividadeController.removerAtividade.bind(atividadeController));
exports.router.post(baseUrl, atividadeController.criarAtividade.bind(atividadeController));
exports.router.get(baseUrl + '/:idCurso', atividadeController.listarAtividades.bind(atividadeController));
//# sourceMappingURL=atividade.js.map