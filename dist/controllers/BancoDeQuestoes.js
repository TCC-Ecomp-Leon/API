"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancoDeQuestoesController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const listarQuestoes_1 = require("../navigations/bancoDeQuestoes.ts/listarQuestoes");
const removerQuestao_1 = require("../navigations/bancoDeQuestoes.ts/removerQuestao");
class BancoDeQuestoesController extends controller_1.default {
    listarQuestoes(req, res) {
        this.runNavigation(listarQuestoes_1.listarQuestoesBancoDeQuestoesNavigation, req, res);
    }
    removerQuestao(req, res) {
        this.runNavigation(removerQuestao_1.removerQuestaoBancoDeQuestoesNavigation, req, res);
    }
}
exports.BancoDeQuestoesController = BancoDeQuestoesController;
//# sourceMappingURL=BancoDeQuestoes.js.map