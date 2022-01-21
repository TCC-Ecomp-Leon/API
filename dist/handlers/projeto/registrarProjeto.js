"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarProjetoHandler = void 0;
const database_1 = require("../../config/database");
const projeto_1 = require("../../schemas/projeto");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.registrarProjetoHandler = new handler_1.default(async (context) => {
    const body = context.body;
    if (!projeto_1.RegistroProjetoValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(projeto_1.RegistroProjetoValidator.errors),
            },
        };
    }
    const service = async (db, session) => {
        const informacoes = body;
        const consultaExistenciaProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(informacoes.email, db, session);
        if (consultaExistenciaProjeto.success) {
            return {
                status: 409,
                body: {
                    error: 'DATA_ALREADY_EXISTS',
                },
            };
        }
        const result = await RepositorioProjeto_1.default.adicionarProjeto(informacoes.nome, informacoes.descricao, informacoes.email, informacoes.telefone, informacoes.imgProjeto, informacoes.endereco, db, session);
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
//# sourceMappingURL=registrarProjeto.js.map