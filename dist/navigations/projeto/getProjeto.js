"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetoNavigation = void 0;
const getProjeto_1 = require("../../handlers/projeto/getProjeto");
const navigation_1 = require("../../structure/navigation");
exports.getProjetoNavigation = navigation_1.ProtectedNavigation([getProjeto_1.getProjetoHandler]);
//# sourceMappingURL=getProjeto.js.map