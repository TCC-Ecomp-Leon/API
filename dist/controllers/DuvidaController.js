"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuvidaController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const criarDuvida_1 = require("../navigations/duvida/criarDuvida");
const iteragirDuvida_1 = require("../navigations/duvida/iteragirDuvida");
const listarDuvidas_1 = require("../navigations/duvida/listarDuvidas");
const obterDuvida_1 = require("../navigations/duvida/obterDuvida");
class DuvidaController extends controller_1.default {
    criarDuvida(req, res) {
        this.runNavigation(criarDuvida_1.criarDuvidaNavigation, req, res);
    }
    iteragirDuvida(req, res) {
        this.runNavigation(iteragirDuvida_1.iteragirDuvidaNavigation, req, res);
    }
    obterDuvida(req, res) {
        this.runNavigation(obterDuvida_1.obterDuvidaNavigation, req, res);
    }
    listaDeDuvidas(req, res) {
        this.runNavigation(listarDuvidas_1.listarDuvidasNavigation, req, res);
    }
}
exports.DuvidaController = DuvidaController;
//# sourceMappingURL=DuvidaController.js.map