"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responderAtividadeHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const atividade_1 = require("../../schemas/atividade");
const respostaAtividade_1 = require("../../schemas/respostaAtividade");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const RepositorioResposta_1 = __importDefault(require("../../services/repositories/RepositorioResposta"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
const uuid_1 = require("uuid");
const RepositorioUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioUniversitario"));
exports.responderAtividadeHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idAtividade = context.params['idAtividade'];
    const body = context.body;
    if (userProfile.regra !== models_1.RegraPerfil.Geral ||
        (!userProfile.associacoes.aluno.alunoParceiro &&
            !userProfile.universitario.universitario)) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    if (!respostaAtividade_1.RespostaAtividadeValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(atividade_1.InformacoesAtividadeValidator.errors),
            },
        };
    }
    const informacoesResposta = body;
    const service = async (db, session) => {
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(idAtividade, db, session);
        if (!leituraAtividade.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const atividade = leituraAtividade.data;
        if (!userProfile.universitario.universitario) {
            if (!userProfile.associacoes.aluno.alunoParceiro) {
                throw Error('Condicionais erradas');
            }
            const cursosAluno = userProfile.associacoes.aluno.cursos;
            if (cursosAluno.find((curso) => curso.id === atividade.idCurso) ==
                undefined) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
        }
        let result;
        if (informacoesResposta.tipo === models_1.TipoAtividade.Alternativa) {
            result = await RepositorioResposta_1.default.responderAtividadeAlternativa(atividade.idProjeto, atividade.idCurso, atividade.idMateria, idAtividade, userProfile.id, informacoesResposta.respostas, db, session);
        }
        else if (informacoesResposta.tipo === models_1.TipoAtividade.Dissertativa) {
            result = await RepositorioResposta_1.default.responderAtividadeDissertativa(atividade.idProjeto, atividade.idCurso, atividade.idMateria, idAtividade, userProfile.id, informacoesResposta.respostas, db, session);
        }
        else if (informacoesResposta.tipo === models_1.TipoAtividade.BancoDeQuestoes) {
            if (userProfile.regra === models_1.RegraPerfil.Geral &&
                userProfile.universitario.universitario === false) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
            result = await RepositorioResposta_1.default.responderAtividadeBancoDeQuestoes(atividade.idProjeto, atividade.idCurso, atividade.idMateria, idAtividade, userProfile.id, informacoesResposta.respostas.map((info) => ({
                ...info,
                idAtividade: idAtividade,
                idQuestao: uuid_1.v4(),
            })), db, session);
            const castAtividade = atividade;
            if (!result.success)
                throw result.error;
            const result2 = await RepositorioUniversitario_1.default.atrelarColaboracao(userProfile.email, result.data, idAtividade, castAtividade.tempoColaboracao, db, session);
            if (!result2.success)
                throw result2.error;
        }
        else {
            throw Error('Resposta de atividade com tipo inválido');
        }
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: {
                idResposta: result.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=responderAtividade.js.map