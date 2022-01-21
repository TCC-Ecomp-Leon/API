"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerQuestaoBancoDeQuestoesNavigation = void 0;
const removerQuestao_1 = require("../../handlers/bancoDeQuestoes/removerQuestao");
const navigation_1 = require("../../structure/navigation");
exports.removerQuestaoBancoDeQuestoesNavigation = navigation_1.ProtectedNavigation([
    removerQuestao_1.removerQuestaoBancoDeQuestoesHandler,
]);
//# sourceMappingURL=removerQuestao.js.map