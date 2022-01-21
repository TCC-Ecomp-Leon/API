"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteragirDuvidaNavigation = void 0;
const iteragirDuvida_1 = require("../../handlers/duvida/iteragirDuvida");
const navigation_1 = require("../../structure/navigation");
exports.iteragirDuvidaNavigation = navigation_1.ProtectedNavigation([
    iteragirDuvida_1.iteragirDuvidaHandler,
]);
//# sourceMappingURL=iteragirDuvida.js.map