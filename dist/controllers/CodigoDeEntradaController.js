"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodigoDeEntradaController = void 0;
const controller_1 = __importDefault(require("../structure/controller"));
const getCodigos_1 = require("../navigations/codigoDeEntrada/getCodigos");
const criarCodigo_1 = require("../navigations/codigoDeEntrada/criarCodigo");
const deletarCodigo_1 = require("../navigations/codigoDeEntrada/deletarCodigo");
const usarCodigo_1 = require("../navigations/codigoDeEntrada/usarCodigo");
class CodigoDeEntradaController extends controller_1.default {
    getCodigos(req, res) {
        this.runNavigation(getCodigos_1.getCodigosNavigation, req, res);
    }
    criarCodigo(req, res) {
        this.runNavigation(criarCodigo_1.criarCodigoNavigation, req, res);
    }
    deletarCodigo(req, res) {
        this.runNavigation(deletarCodigo_1.deletarCodigoNavigation, req, res);
    }
    usarCodigo(req, res) {
        this.runNavigation(usarCodigo_1.usarCodigoNavigation, req, res);
    }
}
exports.CodigoDeEntradaController = CodigoDeEntradaController;
//# sourceMappingURL=CodigoDeEntradaController.js.map