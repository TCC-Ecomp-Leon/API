"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetosHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.getProjetosHandler = new handler_1.default(async (context) => {
    let pesquisaPorEmail = context.query['email'];
    const userProfile = navigation_1.getCurrentProfile(context);
    const service = async (db, session) => {
        if (pesquisaPorEmail !== undefined) {
            pesquisaPorEmail = pesquisaPorEmail;
            const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(pesquisaPorEmail, db, session);
            if (!leituraProjeto.success) {
                return {
                    status: 404,
                    body: {
                        error: 'PROJETO_NAO_ENCONTRADO',
                    },
                };
            }
            return {
                status: 200,
                body: {
                    projetos: [leituraProjeto.data],
                },
            };
        }
        const readProjetos = await RepositorioProjeto_1.default.readProjetos(true, db, session);
        if (!readProjetos.success) {
            throw readProjetos.error;
        }
        return {
            status: 200,
            body: {
                projetos: readProjetos.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=getProjetos.js.map