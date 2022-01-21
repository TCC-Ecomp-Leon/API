"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarCodigoNavigation = void 0;
const criarCodigo_1 = require("../../handlers/codigoDeEntrada/criarCodigo");
const navigation_1 = require("../../structure/navigation");
exports.criarCodigoNavigation = navigation_1.ProtectedNavigation([criarCodigo_1.criarCodigoHandler]);
//# sourceMappingURL=criarCodigo.js.map