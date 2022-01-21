"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarProjetoHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const projeto_1 = require("../../schemas/projeto");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.atualizarProjetoHandler = new handler_1.default(async (context) => {
    const idProjeto = context.params['id'];
    const body = context.body;
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra === models_1.RegraPerfil.Geral) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    if (!projeto_1.AtualizarProjetoValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(projeto_1.AtualizarProjetoValidator.errors),
            },
        };
    }
    const informacoes = body;
    const service = async (db, session) => {
        if (userProfile.regra === models_1.RegraPerfil.Projeto) {
            const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
            if (!readProjeto.success) {
                return {
                    status: 404,
                    body: {
                        error: 'PROJETO_NAO_ENCONTRADO',
                    },
                };
            }
            const projeto = readProjeto.data;
            if (projeto.email !== userProfile.email) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
        }
        const atualizacaoProjeto = await RepositorioProjeto_1.default.atualizarProjeto(idProjeto, informacoes, db, session);
        if (!atualizacaoProjeto.success) {
            throw atualizacaoProjeto.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=atualizarProjeto.js.map