"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerRespostasPorPerfilHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
const RepositorioResposta_1 = __importDefault(require("../../services/repositories/RepositorioResposta"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.lerRespostasPorPerfilHandler = new handler_1.default(async (context) => {
    const idPerfil = context.params['idPerfil'];
    const idAtividade = context.params['idAtividade'];
    const service = async (db, session) => {
        const authInfo = await firebaseAuth_1.readAuthProfile(idPerfil);
        if (!authInfo.success) {
            return {
                status: 404,
                body: {
                    error: 'PROFILE_NOT_FOUND',
                },
            };
        }
        const leituraPerfil = await RepositorioPerfil_1.default.readPerfil(idPerfil, authInfo.data.email, true, db, session);
        if (!leituraPerfil.success) {
            return {
                status: 404,
                body: {
                    error: 'PROFILE_NOT_FOUND',
                },
            };
        }
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(idAtividade, db, session);
        if (!leituraAtividade.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const perfil = leituraPerfil.data;
        const atividade = leituraAtividade.data;
        const idProjeto = atividade.idProjeto;
        const alunoProjeto = perfil.regra === models_1.RegraPerfil.Geral &&
            perfil.associacoes.aluno.alunoParceiro &&
            perfil.associacoes.aluno.cursos.filter((curso) => curso.idProjeto === idProjeto).length > 0;
        const universitario = !alunoProjeto &&
            perfil.regra === models_1.RegraPerfil.Geral &&
            perfil.universitario.universitario;
        if (alunoProjeto) {
            const leitura = await RepositorioResposta_1.default.lerRespostasDeUmAlunoEmUmaAtividade(idAtividade, idPerfil, db, session);
            if (!leitura.success) {
                throw leitura.error;
            }
            return {
                status: 200,
                body: {
                    respostas: leitura.data,
                },
            };
        }
        else if (universitario) {
            const leitura = await RepositorioResposta_1.default.lerRespostasBancoDeQuestoesUniversitario(idPerfil, db, session);
            if (!leitura.success) {
                throw leitura.error;
            }
            return {
                status: 200,
                body: {
                    respostas: leitura.data,
                },
            };
        }
        return {
            status: 200,
            body: {
                respostas: [],
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=lerRespostasPorPerfil.js.map