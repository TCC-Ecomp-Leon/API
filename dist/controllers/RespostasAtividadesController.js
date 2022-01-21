"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespostasAtividadesController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const responderAtividade_1 = require("../navigations/respostaAtividade/responderAtividade");
const lerResposta_1 = require("../navigations/respostaAtividade/lerResposta");
const listarRespostas_1 = require("../navigations/respostaAtividade/listarRespostas");
const interagirResposta_1 = require("../navigations/respostaAtividade/interagirResposta");
const lerRespostasPorPerfil_1 = require("../navigations/respostaAtividade/lerRespostasPorPerfil");
class RespostasAtividadesController extends controller_1.default {
    responderAtividade(req, res) {
        this.runNavigation(responderAtividade_1.responderAtividadeNavigation, req, res);
    }
    lerResposta(req, res) {
        this.runNavigation(lerResposta_1.lerRespostaNavigation, req, res);
    }
    listarRespostas(req, res) {
        this.runNavigation(listarRespostas_1.listarRespostasNavigation, req, res);
    }
    interagirResposta(req, res) {
        this.runNavigation(interagirResposta_1.interagirRespostaNavigation, req, res);
    }
    lerRespostasPorPerfil(req, res) {
        this.runNavigation(lerRespostasPorPerfil_1.lerRespostasPorPerfilNavigation, req, res);
    }
}
exports.RespostasAtividadesController = RespostasAtividadesController;
//# sourceMappingURL=RespostasAtividadesController.js.map