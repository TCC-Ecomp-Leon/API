"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usarCodigoHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioCodigoDeEntrada_1 = __importDefault(require("../../services/repositories/RepositorioCodigoDeEntrada"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.usarCodigoHandler = new handler_1.default(async (context) => {
    const userProfile = context.getVariable('profile');
    if (userProfile.regra !== models_1.RegraPerfil.Geral) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const idCodigo = context.params['id'];
    const service = async (db, session) => {
        const readCodigo = await RepositorioCodigoDeEntrada_1.default.readCodigoDeEntrada(idCodigo, db, session);
        if (!readCodigo.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const codigo = readCodigo.data;
        if (codigo.usado) {
            return {
                status: 406,
                body: {
                    error: 'CODIGO_JA_USADO',
                },
            };
        }
        if (codigo.tipo === models_1.TipoCodigoDeEntrada.Aluno) {
            const adicaoAlunoCurso = await RepositorioProjeto_1.default.adicionarAlunoAoCurso(codigo.idProjeto, codigo.idCurso, userProfile.id, db, session);
            if (!adicaoAlunoCurso.success) {
                throw adicaoAlunoCurso.error;
            }
        }
        else if (codigo.tipo === models_1.TipoCodigoDeEntrada.Professor) {
            const atribuicaoProfessor = await RepositorioProjeto_1.default.atribuirProfessorAMateria(codigo.idProjeto, codigo.idCurso, codigo.idMateria, userProfile.id, db, session);
            if (!atribuicaoProfessor.success) {
                throw atribuicaoProfessor.error;
            }
        }
        else {
            throw Error('Código de entrada com tipo errado');
        }
        const usarCodigo = await RepositorioCodigoDeEntrada_1.default.usarCodigoDeEntrada(idCodigo, userProfile.id, db, session);
        if (!usarCodigo.success) {
            throw usarCodigo.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=usarCodigo.js.map