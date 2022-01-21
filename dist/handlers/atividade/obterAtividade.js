"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obterAtividadeHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.obterAtividadeHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idAtividade = context.params['idAtividade'];
    const service = async (db, session) => {
        const result = await RepositorioAtividade_1.default.lerAtividade(idAtividade, db, session);
        if (!result.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        return {
            status: 200,
            body: {
                atividade: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=obterAtividade.js.map