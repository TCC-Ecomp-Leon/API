"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizacaoCursoUniversitarioNavigation = void 0;
const atualizacaoCursoUniversitario_1 = require("../../handlers/cursoUniversitario.ts/atualizacaoCursoUniversitario");
const models_1 = require("../../models");
const navigation_1 = require("../../structure/navigation");
exports.atualizacaoCursoUniversitarioNavigation = navigation_1.ProtectedNavigation([atualizacaoCursoUniversitario_1.atualizacaoCursoUniversitarioHandler], (profile) => profile.regra === models_1.RegraPerfil.Administrador);
//# sourceMappingURL=atualizacaoCursoUniversitario.js.map