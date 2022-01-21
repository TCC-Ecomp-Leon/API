"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responderAtividadeNavigation = void 0;
const responderAtividade_1 = require("../../handlers/respostaAtividade/responderAtividade");
const navigation_1 = require("../../structure/navigation");
exports.responderAtividadeNavigation = navigation_1.ProtectedNavigation([
    responderAtividade_1.responderAtividadeHandler,
]);
//# sourceMappingURL=responderAtividade.js.map