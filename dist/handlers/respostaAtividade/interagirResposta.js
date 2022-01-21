"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interagirRespostaHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const respostaAtividade_1 = require("../../schemas/respostaAtividade");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const RepositorioResposta_1 = __importDefault(require("../../services/repositories/RepositorioResposta"));
const RepositorioUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.interagirRespostaHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const idResposta = context.params['idResposta'];
    const body = context.body;
    if (userProfile.regra === models_1.RegraPerfil.Geral) {
        if (!userProfile.associacoes.professor.professor &&
            !userProfile.universitario.universitario) {
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
    }
    const service = async (db, session) => {
        const leituraResposta = await RepositorioResposta_1.default.lerResposta(idResposta, db, session);
        if (!leituraResposta.success) {
            return {
                status: 404,
                body: {
                    error: 'DATA_NOT_FOUND',
                },
            };
        }
        const resposta = leituraResposta.data;
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(resposta.idAtividade, db, session);
        if (!leituraAtividade.success) {
            throw leituraAtividade.error;
        }
        const atividade = leituraAtividade.data;
        if (atividade.tipoAtividade !== resposta.tipo) {
            throw Error('');
        }
        if (resposta.tipo === models_1.TipoAtividade.Alternativa) {
            //Interação impossibilitada
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
        else if (resposta.tipo === models_1.TipoAtividade.Dissertativa) {
            const castAtividade = atividade;
            if (!resposta.corrigida) {
                //Se a resposta ainda não tiver sido corrigida a interação apenas para correção da atividade
                //permissões: administrador, universitário, projeto da atividade e professor da atividade
                let permissao = false;
                const { idProjeto, idCurso, idMateria } = resposta;
                if (userProfile.regra === models_1.RegraPerfil.Geral) {
                    if (userProfile.associacoes.professor.professor) {
                        const idMateriasProfessor = userProfile.associacoes.professor.materiasProfessor.map((materia) => materia.id);
                        if (idMateria !== null &&
                            idMateriasProfessor.includes(idMateria)) {
                            permissao = true;
                        }
                    }
                    if (userProfile.universitario.universitario) {
                        permissao = true;
                    }
                }
                else if (userProfile.regra === models_1.RegraPerfil.Administrador) {
                    permissao = true;
                }
                else {
                    const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
                    if (!leituraProjeto.success) {
                        throw leituraProjeto.error;
                    }
                    const projeto = leituraProjeto.data;
                    if (projeto.id === idProjeto) {
                        permissao = true;
                    }
                }
                if (!permissao) {
                    return {
                        status: 403,
                        body: {
                            error: 'NOT_AUTHORIZED',
                        },
                    };
                }
                if (!respostaAtividade_1.CorrecaoQuestoesDissertativasValidator(body)) {
                    return {
                        status: 400,
                        body: {
                            error: JSON.stringify(respostaAtividade_1.CorrecaoQuestoesDissertativasValidator.errors),
                        },
                    };
                }
                const informacoes = body;
                let nota = 0.0;
                let totalPesos = 0.0;
                for (let i = 0; i < castAtividade.itens.length; i++) {
                    const item = castAtividade.itens[i];
                    const { idQuestao, peso } = item;
                    const questaoCorrigida = informacoes.find((info) => info.idQuestao === idQuestao);
                    if (questaoCorrigida === undefined) {
                        return {
                            status: 400,
                            body: {
                                error: idQuestao + ' sem correspondência na correção',
                            },
                        };
                    }
                    const notaQuestao = questaoCorrigida.nota;
                    nota = nota + peso * notaQuestao;
                    totalPesos = totalPesos + peso;
                }
                const result = await RepositorioResposta_1.default.corrigirAtividadeDissertativa(idResposta, userProfile.id, nota / totalPesos, informacoes.map((info) => ({
                    ...info,
                    idProjeto: idProjeto,
                    idCurso: idCurso,
                    idMateria: idMateria,
                })), db, session);
                if (!result.success) {
                    throw result.error;
                }
                if (userProfile.regra === models_1.RegraPerfil.Geral &&
                    userProfile.universitario.universitario) {
                    const atrelarAtividadeUniversitario = await RepositorioUniversitario_1.default.atrelarColaboracao(userProfile.email, idResposta, castAtividade.id, castAtividade.tempoColaboracao, db, session, true);
                    if (!atrelarAtividadeUniversitario.success) {
                        throw atrelarAtividadeUniversitario.error;
                    }
                }
                return {
                    status: 200,
                    body: null,
                };
            }
            else {
                //Se já tiver sido corrigida ou o aluno está requisitando uma revisão
                //ou um projeto está atendendo a uma requisição de revisão
                if (resposta.revisao === models_1.EstadoRevisao.Nenhum) {
                    const { idAluno } = resposta;
                    if (userProfile.id !== idAluno) {
                        return {
                            status: 403,
                            body: {
                                error: 'NOT_AUTHORIZED',
                            },
                        };
                    }
                    const result = await RepositorioResposta_1.default.requisitarRevisaoAtividadeDissertativa(idResposta, db, session);
                    if (!result.success) {
                        throw result.error;
                    }
                    return {
                        status: 200,
                        body: null,
                    };
                }
                else if (resposta.revisao === models_1.EstadoRevisao.Requisitada) {
                    let permissao = false;
                    const { idProjeto, idCurso, idMateria } = resposta;
                    if (userProfile.regra === models_1.RegraPerfil.Geral) {
                        if (userProfile.associacoes.professor.professor) {
                            const idMateriasProfessor = userProfile.associacoes.professor.materiasProfessor.map((materia) => materia.id);
                            if (idMateria !== null &&
                                idMateriasProfessor.includes(idMateria)) {
                                permissao = true;
                            }
                        }
                    }
                    else if (userProfile.regra === models_1.RegraPerfil.Administrador) {
                        permissao = true;
                    }
                    else {
                        const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
                        if (!leituraProjeto.success) {
                            throw leituraProjeto.error;
                        }
                        const projeto = leituraProjeto.data;
                        if (projeto.id === idProjeto) {
                            permissao = true;
                        }
                    }
                    if (!permissao) {
                        return {
                            status: 403,
                            body: {
                                error: 'NOT_AUTHORIZED',
                            },
                        };
                    }
                    if (!respostaAtividade_1.CorrecaoQuestoesDissertativasValidator(body)) {
                        return {
                            status: 400,
                            body: {
                                error: JSON.stringify(respostaAtividade_1.CorrecaoQuestoesDissertativasValidator.errors),
                            },
                        };
                    }
                    const informacoes = body;
                    let nota = 0.0;
                    let totalPesos = 0.0;
                    for (let i = 0; i < castAtividade.itens.length; i++) {
                        const item = castAtividade.itens[i];
                        const { idQuestao, peso } = item;
                        const questaoCorrigida = informacoes.find((info) => info.idQuestao === idQuestao);
                        if (questaoCorrigida === undefined) {
                            return {
                                status: 400,
                                body: {
                                    error: idQuestao + ' sem correspondência na correção',
                                },
                            };
                        }
                        const notaQuestao = questaoCorrigida.nota;
                        nota = nota + peso * notaQuestao;
                        totalPesos = totalPesos + peso;
                    }
                    const result = await RepositorioResposta_1.default.finalizarRevisaoAtividadeDissertativa(idResposta, nota / totalPesos, informacoes.map((info) => ({
                        ...info,
                        idProjeto: idProjeto,
                        idCurso: idCurso,
                        idMateria: idMateria,
                    })), db, session);
                    if (!result.success) {
                        throw result.error;
                    }
                    return {
                        status: 200,
                        body: null,
                    };
                }
                else {
                    return {
                        status: 406,
                        body: {
                            error: 'REVISAO_JA_APROVADA',
                        },
                    };
                }
            }
        }
        else if (resposta.tipo === models_1.TipoAtividade.BancoDeQuestoes) {
            const castAtividade = atividade;
            //Interação apenas para aprovar questões para um banco de questões
            //permissões: projeto e professor
            let permissao = false;
            const { idProjeto, idCurso, idMateria } = resposta;
            if (userProfile.regra === models_1.RegraPerfil.Geral) {
                if (userProfile.associacoes.professor.professor) {
                    const idMateriasProfessor = userProfile.associacoes.professor.materiasProfessor.map((materia) => materia.id);
                    if (idMateria !== null && idMateriasProfessor.includes(idMateria)) {
                        permissao = true;
                    }
                }
            }
            else if (userProfile.regra === models_1.RegraPerfil.Projeto) {
                const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
                if (!leituraProjeto.success) {
                    throw leituraProjeto.error;
                }
                const projeto = leituraProjeto.data;
                if (projeto.id === idProjeto) {
                    permissao = true;
                }
            }
            if (!permissao) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
            if (!respostaAtividade_1.InformacoesAvaliacaoBancoDeQuestaoValidator(body)) {
                return {
                    status: 400,
                    body: {
                        error: JSON.stringify(respostaAtividade_1.InformacoesAvaliacaoBancoDeQuestaoValidator.errors),
                    },
                };
            }
            const informacoes = body;
            const result = await RepositorioResposta_1.default.avaliarRespostasBanco(idResposta, userProfile.id, informacoes, db, session);
            if (!result.success) {
                throw result.error;
            }
            const aprovacaoQuestoesBancoDeQuestoes = await RepositorioUniversitario_1.default.aprovarAtividades([idResposta], db, session);
            if (!aprovacaoQuestoesBancoDeQuestoes.success)
                throw aprovacaoQuestoesBancoDeQuestoes.error;
            return {
                status: 200,
                body: null,
            };
        }
        else {
            throw Error('Reposta com tipo de atividade inválido');
        }
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=interagirResposta.js.map