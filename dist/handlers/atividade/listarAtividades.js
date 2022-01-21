"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAtividadesHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioAtividade_1 = __importStar(require("../../services/repositories/RepositorioAtividade"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.listarAtividadesHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idCurso = context.params['idCurso'];
    const queryParamAbertas = context.query['abertas'];
    let lerAtividadesAbertas = RepositorioAtividade_1.SituacaoAtividadeLeitura.todas;
    if (queryParamAbertas !== undefined) {
        const param = queryParamAbertas;
        if (param === 'true') {
            lerAtividadesAbertas = RepositorioAtividade_1.SituacaoAtividadeLeitura.aberta;
        }
        else if (param === 'false') {
            lerAtividadesAbertas = RepositorioAtividade_1.SituacaoAtividadeLeitura.fechada;
        }
    }
    const service = async (db, session) => {
        const aluno = userProfile.regra === models_1.RegraPerfil.Geral &&
            userProfile.associacoes.aluno.alunoParceiro &&
            userProfile.associacoes.aluno.cursos.filter((curso) => curso.id == idCurso).length > 0;
        const universitario = !aluno &&
            userProfile.regra === models_1.RegraPerfil.Geral &&
            userProfile.universitario.universitario;
        const result = await RepositorioAtividade_1.default.lerAtividadesEspecificas('idCurso', idCurso, lerAtividadesAbertas, aluno, universitario, db, session);
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: {
                atividades: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=listarAtividades.js.map