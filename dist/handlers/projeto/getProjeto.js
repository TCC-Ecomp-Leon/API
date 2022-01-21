"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetoHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.getProjetoHandler = new handler_1.default(async (context) => {
    const idProjeto = context.params['id'];
    const userProfile = navigation_1.getCurrentProfile(context);
    const service = async (db, session) => {
        const leituraProjeto = await RepositorioProjeto_1.default.readProjeto(idProjeto, db, session);
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
                projeto: leituraProjeto.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=getProjeto.js.map