"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarCursoNavigation = void 0;
const atualizarCurso_1 = require("../../handlers/curso/atualizarCurso");
const navigation_1 = require("../../structure/navigation");
exports.atualizarCursoNavigation = navigation_1.ProtectedNavigation([
    atualizarCurso_1.atualizarCursoHandler,
]);
//# sourceMappingURL=atualizarCurso.js.map