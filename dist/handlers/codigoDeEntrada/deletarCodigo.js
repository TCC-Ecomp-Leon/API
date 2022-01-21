"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarCodigoHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioCodigoDeEntrada_1 = __importDefault(require("../../services/repositories/RepositorioCodigoDeEntrada"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.deletarCodigoHandler = new handler_1.default(async (context) => {
    const id = context.params['id'];
    const userProfile = context.getVariable('profile');
    if (userProfile.regra == models_1.RegraPerfil.Geral) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        if (userProfile.regra !== models_1.RegraPerfil.Administrador) {
            const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
            if (!readProjeto.success) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
        }
        const result = await RepositorioCodigoDeEntrada_1.default.removerCodigoDeEntrada(id, db, session);
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
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=deletarCodigo.js.map