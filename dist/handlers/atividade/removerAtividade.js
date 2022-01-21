"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerAtividadeHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.removerAtividadeHandler = new handler_1.default(async (context) => {
    const idAtividade = context.params['id'];
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra !== models_1.RegraPerfil.Administrador &&
        userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(idAtividade, db, session);
        if (!leituraAtividade.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const atividade = leituraAtividade.data;
        if (userProfile.regra === models_1.RegraPerfil.Projeto) {
            const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
            if (!leituraProjeto.success) {
                throw leituraProjeto.error;
            }
            if (leituraProjeto.data.id !== atividade.idProjeto) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
        }
        const result = await RepositorioAtividade_1.default.removerAtividade(idAtividade, db, session);
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=removerAtividade.js.map