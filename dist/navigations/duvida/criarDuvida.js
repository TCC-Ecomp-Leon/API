"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarDuvidaNavigation = void 0;
const criarDuvida_1 = require("../../handlers/duvida/criarDuvida");
const navigation_1 = require("../../structure/navigation");
exports.criarDuvidaNavigation = navigation_1.ProtectedNavigation([criarDuvida_1.criarDuvidaHandler]);
//# sourceMappingURL=criarDuvida.js.map