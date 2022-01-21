"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodigosNavigation = void 0;
const getCodigos_1 = require("../../handlers/codigoDeEntrada/getCodigos");
const navigation_1 = require("../../structure/navigation");
exports.getCodigosNavigation = navigation_1.ProtectedNavigation([getCodigos_1.getCodigosHandler]);
//# sourceMappingURL=getCodigos.js.map