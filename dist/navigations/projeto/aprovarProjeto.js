"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aprovarProjetoNavigation = void 0;
const aprovarProjeto_1 = require("../../handlers/projeto/aprovarProjeto");
const models_1 = require("../../models");
const navigation_1 = require("../../structure/navigation");
exports.aprovarProjetoNavigation = navigation_1.ProtectedNavigation([aprovarProjeto_1.aprovarProjetoHandler], (perfil) => perfil.regra === models_1.RegraPerfil.Administrador);
//# sourceMappingURL=aprovarProjeto.js.map