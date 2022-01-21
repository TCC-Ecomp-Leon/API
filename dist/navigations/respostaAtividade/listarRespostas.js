"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarRespostasNavigation = void 0;
const listarRespostas_1 = require("../../handlers/respostaAtividade/listarRespostas");
const navigation_1 = require("../../structure/navigation");
exports.listarRespostasNavigation = navigation_1.ProtectedNavigation([
    listarRespostas_1.listarRespostasHandler,
]);
//# sourceMappingURL=listarRespostas.js.map