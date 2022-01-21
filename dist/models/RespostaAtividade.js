"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusRespostaDissertativa = exports.EstadoRevisao = void 0;
var EstadoRevisao;
(function (EstadoRevisao) {
    EstadoRevisao[EstadoRevisao["Nenhum"] = 1] = "Nenhum";
    EstadoRevisao[EstadoRevisao["Requisitada"] = 2] = "Requisitada";
    EstadoRevisao[EstadoRevisao["Finalizada"] = 3] = "Finalizada";
})(EstadoRevisao = exports.EstadoRevisao || (exports.EstadoRevisao = {}));
var StatusRespostaDissertativa;
(function (StatusRespostaDissertativa) {
    StatusRespostaDissertativa[StatusRespostaDissertativa["Errado"] = 1] = "Errado";
    StatusRespostaDissertativa[StatusRespostaDissertativa["Certo"] = 2] = "Certo";
    StatusRespostaDissertativa[StatusRespostaDissertativa["ParcialmenteCerto"] = 3] = "ParcialmenteCerto";
})(StatusRespostaDissertativa = exports.StatusRespostaDissertativa || (exports.StatusRespostaDissertativa = {}));
//# sourceMappingURL=RespostaAtividade.js.map