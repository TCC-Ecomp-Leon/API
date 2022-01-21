"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAtividadesNavigation = void 0;
const listarAtividades_1 = require("../../handlers/atividade/listarAtividades");
const navigation_1 = require("../../structure/navigation");
exports.listarAtividadesNavigation = navigation_1.ProtectedNavigation([
    listarAtividades_1.listarAtividadesHandler,
]);
//# sourceMappingURL=listarAtividades.js.map