"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarRespostasHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioResposta_1 = __importDefault(require("../../services/repositories/RepositorioResposta"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.listarRespostasHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const queryParamProjeto = context.query['projeto'];
    const queryParamAtividade = context.query['atividade'];
    let idProjeto = undefined;
    let idAtividade = undefined;
    if (queryParamProjeto !== undefined) {
        idProjeto = queryParamProjeto;
    }
    if (queryParamAtividade !== undefined) {
        idAtividade = queryParamAtividade;
    }
    if (userProfile.regra === models_1.RegraPerfil.Geral &&
        !userProfile.universitario.universitario) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        let result;
        if (idAtividade !== undefined) {
            result = await RepositorioResposta_1.default.lerRespostasEspecificas('idAtividade', idAtividade, db, session);
        }
        else if (idProjeto !== undefined) {
            result = await RepositorioResposta_1.default.lerRespostasEspecificas('idProjeto', idAtividade, db, session);
        }
        else {
            result = await RepositorioResposta_1.default.lerRespostas(db, session);
        }
        if (!result.success)
            throw result.error;
        return {
            status: 200,
            body: {
                respostas: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=listarRespostas.js.map