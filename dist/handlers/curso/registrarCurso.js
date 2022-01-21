"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarCursoHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const curso_1 = require("../../schemas/curso");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.RegistrarCursoHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const idProjeto = context.params['idProjeto'];
    const body = context.body;
    if (!curso_1.ValidateCurso(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(curso_1.ValidateCurso.errors),
            },
        };
    }
    const service = async (db, session) => {
        const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
        if (!leituraProjeto.success) {
            return {
                status: 404,
                body: {
                    error: 'PROJETO_NAO_ENCONTRADO',
                },
            };
        }
        if (idProjeto !== leituraProjeto.data.id) {
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
        const registro = await RepositorioProjeto_1.default.adicionarCurso(idProjeto, {
            ...body,
            inicioCurso: new Date(body.inicioCurso),
            fimCurso: new Date(body.fimCurso),
        }, db, session);
        if (!registro.success) {
            throw registro.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=registrarCurso.js.map