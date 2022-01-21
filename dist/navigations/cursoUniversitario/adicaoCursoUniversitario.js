"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicaoCursoUniversitarioNavigation = void 0;
const adicaoCursoUniversitario_1 = require("../../handlers/cursoUniversitario.ts/adicaoCursoUniversitario");
const models_1 = require("../../models");
const navigation_1 = require("../../structure/navigation");
exports.adicaoCursoUniversitarioNavigation = navigation_1.ProtectedNavigation([adicaoCursoUniversitario_1.adicaoCursoUniversitarioHandler], (profile) => profile.regra === models_1.RegraPerfil.Administrador);
//# sourceMappingURL=adicaoCursoUniversitario.js.map