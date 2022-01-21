"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarCodigoNavigation = void 0;
const deletarCodigo_1 = require("../../handlers/codigoDeEntrada/deletarCodigo");
const navigation_1 = require("../../structure/navigation");
exports.deletarCodigoNavigation = navigation_1.ProtectedNavigation([
    deletarCodigo_1.deletarCodigoHandler,
]);
//# sourceMappingURL=deletarCodigo.js.map