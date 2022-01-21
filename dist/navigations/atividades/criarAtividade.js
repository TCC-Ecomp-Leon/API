"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarAtividadeNavigation = void 0;
const criarAtividade_1 = require("../../handlers/atividade/criarAtividade");
const navigation_1 = require("../../structure/navigation");
exports.criarAtividadeNavigation = navigation_1.ProtectedNavigation([
    criarAtividade_1.criarAtividadeHandler,
]);
//# sourceMappingURL=criarAtividade.js.map