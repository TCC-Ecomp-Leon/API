"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterAtividadeNavigation = void 0;
const obterAtividade_1 = require("../../handlers/atividade/obterAtividade");
const navigation_1 = require("../../structure/navigation");
exports.obterAtividadeNavigation = navigation_1.ProtectedNavigation([
    obterAtividade_1.obterAtividadeHandler,
]);
//# sourceMappingURL=obterAtividade.js.map