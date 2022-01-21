"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerRespostaHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioResposta_1 = __importDefault(require("../../services/repositories/RepositorioResposta"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.lerRespostaHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idResposta = context.params['idResposta'];
    const service = async (db, session) => {
        const leituraResposta = await RepositorioResposta_1.default.lerResposta(idResposta, db, session);
        if (!leituraResposta.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const resposta = leituraResposta.data;
        return {
            status: 200,
            body: {
                resposta: resposta,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=lerResposta.js.map