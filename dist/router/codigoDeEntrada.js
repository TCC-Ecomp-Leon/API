"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const CodigoDeEntradaController_1 = require("../controllers/CodigoDeEntradaController");
exports.router = express_1.default.Router();
const codigoDeEntradaController = new CodigoDeEntradaController_1.CodigoDeEntradaController();
exports.router.delete('/codigo-de-entrada/:id', codigoDeEntradaController.deletarCodigo.bind(codigoDeEntradaController));
exports.router.put('/codigo-de-entrada/:id', codigoDeEntradaController.usarCodigo.bind(codigoDeEntradaController));
exports.router.get('/codigo-de-entrada', codigoDeEntradaController.getCodigos.bind(codigoDeEntradaController));
exports.router.post('/codigo-de-entrada', codigoDeEntradaController.criarCodigo.bind(codigoDeEntradaController));
//# sourceMappingURL=codigoDeEntrada.js.map