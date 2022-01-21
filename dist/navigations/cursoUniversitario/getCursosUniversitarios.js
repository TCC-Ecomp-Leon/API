"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursosUniversitariosNavigation = void 0;
const getCursosUniversitarios_1 = require("../../handlers/cursoUniversitario.ts/getCursosUniversitarios");
const navigation_1 = require("../../structure/navigation");
exports.getCursosUniversitariosNavigation = navigation_1.ProtectedNavigation([
    getCursosUniversitarios_1.getCursosUniversitariosHandler,
]);
//# sourceMappingURL=getCursosUniversitarios.js.map