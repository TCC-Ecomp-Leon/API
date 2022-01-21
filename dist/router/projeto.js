"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const ProjetoController_1 = require("../controllers/ProjetoController");
exports.router = express_1.default.Router();
const projetoController = new ProjetoController_1.ProjetoController();
exports.router.put('/projeto/aprovacao/:id', projetoController.aprovarProjeto.bind(projetoController));
exports.router.post('/projeto/aprovacao', projetoController.registrarProjeto.bind(projetoController));
exports.router.get('/projeto/aprovacao', projetoController.getProjetosNaoAprovados.bind(projetoController));
exports.router.put('/projeto/:id', projetoController.atualizarProjeto.bind(projetoController));
exports.router.get('/projeto/:id', projetoController.getProjeto.bind(projetoController));
exports.router.get('/projeto', projetoController.getProjetos.bind(projetoController));
//# sourceMappingURL=projeto.js.map