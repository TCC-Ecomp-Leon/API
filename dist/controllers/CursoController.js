"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const registrarCurso_1 = require("../navigations/curso/registrarCurso");
const atualizarCurso_1 = require("../navigations/curso/atualizarCurso");
const adicionarMateria_1 = require("../navigations/curso/adicionarMateria");
class CursoController extends controller_1.default {
    registrarCurso(req, res) {
        this.runNavigation(registrarCurso_1.registrarCursoNavigation, req, res);
    }
    atualizarCurso(req, res) {
        this.runNavigation(atualizarCurso_1.atualizarCursoNavigation, req, res);
    }
    adicionarMateria(req, res) {
        this.runNavigation(adicionarMateria_1.adicionarMateriaNavigation, req, res);
    }
}
exports.CursoController = CursoController;
//# sourceMappingURL=CursoController.js.map