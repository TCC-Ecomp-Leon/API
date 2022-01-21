"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarQuestoesBancoDeQuestoesNavigation = void 0;
const listarQuestoes_1 = require("../../handlers/bancoDeQuestoes/listarQuestoes");
const navigation_1 = require("../../structure/navigation");
exports.listarQuestoesBancoDeQuestoesNavigation = navigation_1.ProtectedNavigation([
    listarQuestoes_1.listarQuestoesBancoDeQuestoesHandler,
]);
//# sourceMappingURL=listarQuestoes.js.map