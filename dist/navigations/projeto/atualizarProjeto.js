"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarProjetoNavigation = void 0;
const atualizarProjeto_1 = require("../../handlers/projeto/atualizarProjeto");
const navigation_1 = require("../../structure/navigation");
exports.atualizarProjetoNavigation = navigation_1.ProtectedNavigation([
    atualizarProjeto_1.atualizarProjetoHandler,
]);
//# sourceMappingURL=atualizarProjeto.js.map