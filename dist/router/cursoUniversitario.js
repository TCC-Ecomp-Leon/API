"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const CursoUniversitarioController_1 = require("../controllers/CursoUniversitarioController");
exports.router = express_1.default.Router();
const cursoUniversitarioController = new CursoUniversitarioController_1.CursoUniversitarioController();
const baseUrl = '/curso-universitario';
exports.router.put(baseUrl + '/:id', cursoUniversitarioController.atualizacaoCursoUniversitario.bind(cursoUniversitarioController));
exports.router.delete(baseUrl + '/:id', cursoUniversitarioController.removerCursoUniversitario.bind(cursoUniversitarioController));
exports.router.get(baseUrl, cursoUniversitarioController.getCursosUniversitarios.bind(cursoUniversitarioController));
exports.router.post(baseUrl, cursoUniversitarioController.adicaoCursoUniversitario.bind(cursoUniversitarioController));
//# sourceMappingURL=cursoUniversitario.js.map