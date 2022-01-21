"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjetosNaoAprovadosHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.getProjetosNaoAprovadosHandler = new handler_1.default(async (context) => {
    const service = async (db, session) => {
        const readProjetos = await RepositorioProjeto_1.default.readProjetos(false, db, session);
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
//# sourceMappingURL=getProjetosNaoAprovados.js.map