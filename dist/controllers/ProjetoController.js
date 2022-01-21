"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetoController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const registrarProjeto_1 = require("../navigations/projeto/registrarProjeto");
const aprovarProjeto_1 = require("../navigations/projeto/aprovarProjeto");
const getProjetosNaoAprovados_1 = require("../navigations/projeto/getProjetosNaoAprovados");
const getProjetos_1 = require("../navigations/projeto/getProjetos");
const atualizarProjeto_1 = require("../navigations/projeto/atualizarProjeto");
const getProjeto_1 = require("../navigations/projeto/getProjeto");
class ProjetoController extends controller_1.default {
    registrarProjeto(req, res) {
        this.runNavigation(registrarProjeto_1.registrarProjetoNavigation, req, res);
    }
    aprovarProjeto(req, res) {
        this.runNavigation(aprovarProjeto_1.aprovarProjetoNavigation, req, res);
    }
    getProjetosNaoAprovados(req, res) {
        this.runNavigation(getProjetosNaoAprovados_1.getProjetosNaoAprovadosNavigation, req, res);
    }
    getProjetos(req, res) {
        this.runNavigation(getProjetos_1.getProjetosNavigation, req, res);
    }
    getProjeto(req, res) {
        this.runNavigation(getProjeto_1.getProjetoNavigation, req, res);
    }
    atualizarProjeto(req, res) {
        this.runNavigation(atualizarProjeto_1.atualizarProjetoNavigation, req, res);
    }
}
exports.ProjetoController = ProjetoController;
//# sourceMappingURL=ProjetoController.js.map