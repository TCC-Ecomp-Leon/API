"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterDuvidaNavigation = void 0;
const obterDuvida_1 = require("../../handlers/duvida/obterDuvida");
const navigation_1 = require("../../structure/navigation");
exports.obterDuvidaNavigation = navigation_1.ProtectedNavigation([obterDuvida_1.obterDuvidaHandler]);
//# sourceMappingURL=obterDuvida.js.map