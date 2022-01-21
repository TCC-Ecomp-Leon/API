"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usarCodigoNavigation = void 0;
const usarCodigo_1 = require("../../handlers/codigoDeEntrada/usarCodigo");
const navigation_1 = require("../../structure/navigation");
exports.usarCodigoNavigation = navigation_1.ProtectedNavigation([usarCodigo_1.usarCodigoHandler]);
//# sourceMappingURL=usarCodigo.js.map