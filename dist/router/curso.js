"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const CursoController_1 = require("../controllers/CursoController");
exports.router = express_1.default.Router();
const cursoController = new CursoController_1.CursoController();
exports.router.put('/cursos/:idProjeto/:idCurso', cursoController.atualizarCurso.bind(cursoController));
exports.router.post('/cursos/:idProjeto/:idCurso/materia', cursoController.adicionarMateria.bind(cursoController));
exports.router.post('/cursos/:idProjeto', cursoController.registrarCurso.bind(cursoController));
//# sourceMappingURL=curso.js.map