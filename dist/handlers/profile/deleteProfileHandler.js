"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfileHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.deleteProfileHandler = new handler_1.default(async (context) => {
    const userProfile = context.getVariable('profile');
    const authToken = context.getAuthToken();
    if (authToken === null) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        const dbResult = await RepositorioPerfil_1.default.deletarPerfil(userProfile.id, db, session);
        if (!dbResult.success) {
            throw dbResult.error;
        }
        if (userProfile.regra === models_1.RegraPerfil.Projeto) {
            const remocaoProjeto = await RepositorioProjeto_1.default.removerProjetoPorEmail(userProfile.email, db, session);
            if (!remocaoProjeto.success) {
                throw remocaoProjeto.error;
            }
        }
        const authResult = await firebaseAuth_1.deleteAccount(authToken);
        if (!authResult.success) {
            throw authResult.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=deleteProfileHandler.js.map