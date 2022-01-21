"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarDuvidasNavigation = void 0;
const listaDeDuvidas_1 = require("../../handlers/duvida/listaDeDuvidas");
const navigation_1 = require("../../structure/navigation");
exports.listarDuvidasNavigation = navigation_1.ProtectedNavigation([
    listaDeDuvidas_1.listaDeDuvidasHandler,
]);
//# sourceMappingURL=listarDuvidas.js.map