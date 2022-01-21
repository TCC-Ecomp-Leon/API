"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarProjetoNavigation = void 0;
const registrarProjeto_1 = require("../../handlers/projeto/registrarProjeto");
const navigation_1 = __importDefault(require("../../structure/navigation"));
exports.registrarProjetoNavigation = new navigation_1.default([
    registrarProjeto_1.registrarProjetoHandler,
]);
//# sourceMappingURL=registrarProjeto.js.map