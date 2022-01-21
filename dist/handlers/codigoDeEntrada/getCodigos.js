"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodigosHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioCodigoDeEntrada_1 = __importDefault(require("../../services/repositories/RepositorioCodigoDeEntrada"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.getCodigosHandler = new handler_1.default(async (context) => {
    const userProfile = context.getVariable('profile');
    if (userProfile.regra === models_1.RegraPerfil.Geral) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        let idProjeto = undefined;
        if (userProfile.regra === models_1.RegraPerfil.Projeto) {
            const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
            if (!readProjeto.success) {
                throw readProjeto.error;
            }
            idProjeto = readProjeto.data.id;
        }
        const readCodigos = await RepositorioCodigoDeEntrada_1.default.readCodigosDeEntrada(idProjeto, undefined, undefined, undefined, db, session);
        if (!readCodigos.success) {
            throw readCodigos.error;
        }
        return {
            status: 200,
            body: {
                codigos: readCodigos.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=getCodigos.js.map