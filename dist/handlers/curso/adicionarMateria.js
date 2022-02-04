"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicionarMateriaHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const curso_1 = require("../../schemas/curso");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.adicionarMateriaHandler = new handler_1.default(async (context) => {
    const idProjeto = context.params['idProjeto'];
    const idCurso = context.params['idCurso'];
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const body = context.body;
    if (!curso_1.ValidateMateria(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(curso_1.ValidateAtualizacaoCurso.errors),
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
        const projeto = leituraProjeto.data;
        if (idProjeto !== projeto.id) {
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
        if (!projeto.aprovado) {
            throw Error('Acesso indevido em projeto não aprovado');
        }
        if (projeto.cursos.find((curso) => curso.id === idCurso) === undefined) {
            return {
                status: 404,
                body: {
                    error: 'CURSO_NAO_ENCONTRADO',
                },
            };
        }
        const result = await RepositorioProjeto_1.default.adicionarMateria(idProjeto, idCurso, {
            nome: body.nome,
            descricao: body.descricao,
        }, db, session);
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
//# sourceMappingURL=adicionarMateria.js.map