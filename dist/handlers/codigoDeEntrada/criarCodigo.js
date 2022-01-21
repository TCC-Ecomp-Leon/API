"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarCodigoHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const codigoEntrada_1 = require("../../schemas/codigoEntrada");
const RepositorioCodigoDeEntrada_1 = __importDefault(require("../../services/repositories/RepositorioCodigoDeEntrada"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.criarCodigoHandler = new handler_1.default(async (context) => {
    const body = context.body;
    if (!codigoEntrada_1.ValidatorCriacaoCodigoDeEntrada(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(codigoEntrada_1.ValidatorCriacaoCodigoDeEntrada.errors),
            },
        };
    }
    const informacoesCodigo = body;
    const userProfile = context.getVariable('profile');
    if (userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
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
        if (!projeto.aprovado) {
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
        const curso = projeto.cursos.find((curso) => curso.id === informacoesCodigo.idCurso);
        if (curso === undefined) {
            return {
                status: 404,
                body: {
                    error: 'CURSO_NAO_ENCONTRADO',
                },
            };
        }
        if (informacoesCodigo.tipo === models_1.TipoCodigoDeEntrada.Professor) {
            const materia = curso.materias.find((materia) => materia.id === informacoesCodigo.idMateria);
            if (materia === undefined) {
                return {
                    status: 404,
                    body: {
                        error: 'MATERIA_NAO_ENCONTRADA',
                    },
                };
            }
        }
        const result = await RepositorioCodigoDeEntrada_1.default.addCodigoDeEntrada(readProjeto.data.id, informacoesCodigo, db, session);
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: {
                codigo: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=criarCodigo.js.map