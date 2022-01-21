"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetosNaoAprovadosNavigation = void 0;
const getProjetosNaoAprovados_1 = require("../../handlers/projeto/getProjetosNaoAprovados");
const models_1 = require("../../models");
const navigation_1 = require("../../structure/navigation");
exports.getProjetosNaoAprovadosNavigation = navigation_1.ProtectedNavigation([getProjetosNaoAprovados_1.getProjetosNaoAprovadosHandler], (perfil) => perfil.regra === models_1.RegraPerfil.Administrador);
//# sourceMappingURL=getProjetosNaoAprovados.js.map