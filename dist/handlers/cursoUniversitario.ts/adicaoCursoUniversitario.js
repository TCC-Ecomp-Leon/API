"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adicaoCursoUniversitarioHandler = void 0;
const database_1 = require("../../config/database");
const cursoUniversitario_1 = require("../../schemas/cursoUniversitario");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.adicaoCursoUniversitarioHandler = new handler_1.default(async (context) => {
    const body = context.body;
    if (!cursoUniversitario_1.CursoUniversitarioValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(cursoUniversitario_1.CursoUniversitarioValidator.errors),
            },
        };
    }
    const informacoes = body;
    let cursoUniversitario;
    const service = async (db, session) => {
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
        const addCursoUniversitario = await RepositorioCursoUniversitario_1.default.addCursoUniversitario(cursoUniversitario, db, session);
        if (!addCursoUniversitario.success) {
            throw addCursoUniversitario.error;
        }
        return {
            status: 200,
            body: {
                cursoUniversitario: addCursoUniversitario.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=adicaoCursoUniversitario.js.map