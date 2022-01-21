"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerCursoUniversitarioNavigation = void 0;
const removerCursoUniversitario_1 = require("../../handlers/cursoUniversitario.ts/removerCursoUniversitario");
const models_1 = require("../../models");
const navigation_1 = require("../../structure/navigation");
exports.removerCursoUniversitarioNavigation = navigation_1.ProtectedNavigation([removerCursoUniversitario_1.removerCursoUniversitarioHandler], (profile) => profile.regra === models_1.RegraPerfil.Administrador);
//# sourceMappingURL=removerCursoUniversitario.js.map