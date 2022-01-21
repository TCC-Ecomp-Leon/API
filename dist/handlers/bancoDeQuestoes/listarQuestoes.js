"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarQuestoesBancoDeQuestoesHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioBancoDeQuestoes_1 = __importDefault(require("../../services/repositories/RepositorioBancoDeQuestoes"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.listarQuestoesBancoDeQuestoesHandler = new handler_1.default(async (context) => {
    const idProjeto = context.params['idProjeto'];
    const queryParamCurso = context.query['curso'];
    const queryParamMateria = context.query['materia'];
    const queryParamAssuntos = context.query['assunto'];
    const campoIdProjeto = 'idProjeto';
    const filtros = [
        { key: campoIdProjeto, value: idProjeto },
    ];
    if (queryParamCurso !== undefined) {
        const campoIdCurso = 'idCurso';
        filtros.push({ key: campoIdCurso, value: queryParamCurso });
    }
    if (queryParamMateria !== undefined) {
        const campoIdMateria = 'idMateria';
        filtros.push({ key: campoIdMateria, value: queryParamMateria });
    }
    if (queryParamAssuntos !== undefined) {
        const campoAssunto = 'assuntos';
        const listaAssuntos = queryParamAssuntos;
        listaAssuntos.forEach((assunto) => {
            filtros.push({ key: campoAssunto, value: assunto });
        });
    }
    const service = async (db, session) => {
        const result = await RepositorioBancoDeQuestoes_1.default.lerQuestoesComFiltro(filtros, db, session);
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: {
                questoes: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=listarQuestoes.js.map