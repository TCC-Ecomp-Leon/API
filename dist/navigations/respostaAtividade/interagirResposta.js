"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interagirRespostaNavigation = void 0;
const interagirResposta_1 = require("../../handlers/respostaAtividade/interagirResposta");
const navigation_1 = require("../../structure/navigation");
exports.interagirRespostaNavigation = navigation_1.ProtectedNavigation([
    interagirResposta_1.interagirRespostaHandler,
]);
//# sourceMappingURL=interagirResposta.js.map