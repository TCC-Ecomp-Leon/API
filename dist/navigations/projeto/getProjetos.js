"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetosNavigation = void 0;
const getProjetos_1 = require("../../handlers/projeto/getProjetos");
const navigation_1 = require("../../structure/navigation");
exports.getProjetosNavigation = navigation_1.ProtectedNavigation([getProjetos_1.getProjetosHandler]);
//# sourceMappingURL=getProjetos.js.map