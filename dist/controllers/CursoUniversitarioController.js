"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoUniversitarioController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const adicaoCursoUniversitario_1 = require("../navigations/cursoUniversitario/adicaoCursoUniversitario");
const atualizacaoCursoUniversitario_1 = require("../navigations/cursoUniversitario/atualizacaoCursoUniversitario");
const getCursosUniversitarios_1 = require("../navigations/cursoUniversitario/getCursosUniversitarios");
const removerCursoUniversitario_1 = require("../navigations/cursoUniversitario/removerCursoUniversitario");
class CursoUniversitarioController extends controller_1.default {
    adicaoCursoUniversitario(req, res) {
        this.runNavigation(adicaoCursoUniversitario_1.adicaoCursoUniversitarioNavigation, req, res);
    }
    atualizacaoCursoUniversitario(req, res) {
        this.runNavigation(atualizacaoCursoUniversitario_1.atualizacaoCursoUniversitarioNavigation, req, res);
    }
    getCursosUniversitarios(req, res) {
        this.runNavigation(getCursosUniversitarios_1.getCursosUniversitariosNavigation, req, res);
    }
    removerCursoUniversitario(req, res) {
        this.runNavigation(removerCursoUniversitario_1.removerCursoUniversitarioNavigation, req, res);
    }
}
exports.CursoUniversitarioController = CursoUniversitarioController;
//# sourceMappingURL=CursoUniversitarioController.js.map