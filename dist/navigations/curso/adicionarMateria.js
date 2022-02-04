"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicionarMateriaNavigation = void 0;
const adicionarMateria_1 = require("../../handlers/curso/adicionarMateria");
const navigation_1 = require("../../structure/navigation");
exports.adicionarMateriaNavigation = navigation_1.ProtectedNavigation([
    adicionarMateria_1.adicionarMateriaHandler,
]);
//# sourceMappingURL=adicionarMateria.js.map