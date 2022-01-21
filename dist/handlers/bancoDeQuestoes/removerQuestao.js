"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerQuestaoBancoDeQuestoesHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioBancoDeQuestoes_1 = __importDefault(require("../../services/repositories/RepositorioBancoDeQuestoes"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.removerQuestaoBancoDeQuestoesHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const idQuestao = context.params['idQuestao'];
    const service = async (db, session) => {
        const leituraQuestao = await RepositorioBancoDeQuestoes_1.default.lerQuestao(idQuestao, db, session);
        if (!leituraQuestao.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const questao = leituraQuestao.data;
        const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
        if (!leituraProjeto.success) {
            throw leituraProjeto.error;
        }
        const projeto = leituraProjeto.data;
        if (questao.idProjeto !== projeto.id) {
            return {
                status: 403,
                body: { error: 'NOT_AUTHORIZED' },
            };
        }
        const result = await RepositorioBancoDeQuestoes_1.default.removerQuestao(idQuestao, db, session);
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
//# sourceMappingURL=removerQuestao.js.map