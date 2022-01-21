"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerRespostasPorPerfilNavigation = void 0;
const lerRespostasPorPerfil_1 = require("../../handlers/respostaAtividade/lerRespostasPorPerfil");
const navigation_1 = require("../../structure/navigation");
exports.lerRespostasPorPerfilNavigation = navigation_1.ProtectedNavigation([
    lerRespostasPorPerfil_1.lerRespostasPorPerfilHandler,
]);
//# sourceMappingURL=lerRespostasPorPerfil.js.map