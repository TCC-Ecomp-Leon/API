"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const criarAtividade_1 = require("../navigations/atividades/criarAtividade");
const listarAtividades_1 = require("../navigations/atividades/listarAtividades");
const removerAtividade_1 = require("../navigations/atividades/removerAtividade");
const obterAtividade_1 = require("../navigations/atividades/obterAtividade");
class AtividadeController extends controller_1.default {
    criarAtividade(req, res) {
        this.runNavigation(criarAtividade_1.criarAtividadeNavigation, req, res);
    }
    listarAtividades(req, res) {
        this.runNavigation(listarAtividades_1.listarAtividadesNavigation, req, res);
    }
    removerAtividade(req, res) {
        this.runNavigation(removerAtividade_1.removerAtividadeNavigation, req, res);
    }
    obterAtividade(req, res) {
        this.runNavigation(obterAtividade_1.obterAtividadeNavigation, req, res);
    }
}
exports.AtividadeController = AtividadeController;
//# sourceMappingURL=AtividadeController.js.map