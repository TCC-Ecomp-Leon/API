"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarCursoNavigation = void 0;
const registrarCurso_1 = require("../../handlers/curso/registrarCurso");
const navigation_1 = require("../../structure/navigation");
exports.registrarCursoNavigation = navigation_1.ProtectedNavigation([
    registrarCurso_1.RegistrarCursoHandler,
]);
//# sourceMappingURL=registrarCurso.js.map