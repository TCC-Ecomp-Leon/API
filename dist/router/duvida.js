"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const DuvidaController_1 = require("../controllers/DuvidaController");
exports.router = express_1.default.Router();
const duvidaController = new DuvidaController_1.DuvidaController();
const baseUrl = '/duvida';
exports.router.get(baseUrl + '/:id', duvidaController.obterDuvida.bind(duvidaController));
exports.router.put(baseUrl + '/:id', duvidaController.iteragirDuvida.bind(duvidaController));
exports.router.get(baseUrl, duvidaController.listaDeDuvidas.bind(duvidaController));
exports.router.post(baseUrl, duvidaController.criarDuvida.bind(duvidaController));
//# sourceMappingURL=duvida.js.map