"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizacaoCursoUniversitarioHandler = void 0;
const database_1 = require("../../config/database");
const cursoUniversitario_1 = require("../../schemas/cursoUniversitario");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.atualizacaoCursoUniversitarioHandler = new handler_1.default(async (context) => {
    var _a;
    const body = context.body;
    const idCursoUniversitario = context.params['id'];
    if (!cursoUniversitario_1.AtualizacaoCursoUniversitarioValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(cursoUniversitario_1.AtualizacaoCursoUniversitarioValidator.errors),
            },
        };
    }
    if (((_a = body.cursoAnterior) === null || _a === void 0 ? void 0 : _a.id) === idCursoUniversitario) {
        return {
            status: 400,
            body: {
                error: 'Um curso não pode ter como anterior ele mesmo',
            },
        };
    }
    const service = async (db, session) => {
        const informacoes = body;
        let cursoUniversitario;
        if (informacoes.cursoAnterior !== undefined) {
            if (informacoes.cursoAnterior !== null) {
                const idCursoAnterior = informacoes.cursoAnterior.id;
                const leituraCursoNecessario = await RepositorioCursoUniversitario_1.default.readCursoUniversitario(idCursoAnterior, db, session);
                if (!leituraCursoNecessario.success) {
                    return {
                        status: 404,
                        body: {
                            error: 'DATA_NOT_FOUND',
                        },
                    };
                }
                cursoUniversitario = {
                    ...informacoes,
                    cursoAnterior: leituraCursoNecessario.data,
                };
            }
            else {
                cursoUniversitario = {
                    ...informacoes,
                    cursoAnterior: null,
                };
            }
        }
        else {
            cursoUniversitario = {
                ...informacoes,
                cursoAnterior: undefined,
            };
        }
        const leituraCurso = await RepositorioCursoUniversitario_1.default.readCursoUniversitario(idCursoUniversitario, db, session);
        if (!leituraCurso.success) {
            return {
                status: 404,
                body: {
                    error: 'CURSO_NAO_ENCONTRADO',
                },
            };
        }
        const result = await RepositorioCursoUniversitario_1.default.updateCursoUniversitario(idCursoUniversitario, cursoUniversitario, db, session);
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
//# sourceMappingURL=atualizacaoCursoUniversitario.js.map