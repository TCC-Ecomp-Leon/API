"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerAtividadeNavigation = void 0;
const removerAtividade_1 = require("../../handlers/atividade/removerAtividade");
const navigation_1 = require("../../structure/navigation");
exports.removerAtividadeNavigation = navigation_1.ProtectedNavigation([
    removerAtividade_1.removerAtividadeHandler,
]);
//# sourceMappingURL=removerAtividade.js.map