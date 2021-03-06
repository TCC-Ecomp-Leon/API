import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import {
  Atividade,
  AvaliacaoRespostaBancoDeQuestoes,
  EstadoRevisao,
  Perfil,
  RegraPerfil,
  TipoAtividade,
} from '../../models';
import {
  CorrecaoQuestoesDissertativasValidator,
  InformacoesAvaliacaoBancoDeQuestaoValidator,
  InformacoesCorrecaoQuestoesDissertativas,
} from '../../schemas/respostaAtividade';
import Database from '../../services/data/Database';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import RepositorioResposta from '../../services/repositories/RepositorioResposta';
import RepositorioUniveristario from '../../services/repositories/RepositorioUniversitario';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const interagirRespostaHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    const idResposta = context.params['idResposta'] as string;

    const body = context.body as any;

    if (userProfile.regra === RegraPerfil.Geral) {
      if (
        !userProfile.associacoes.professor.professor &&
        !userProfile.universitario.universitario
      ) {
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      }
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const leituraResposta = await RepositorioResposta.lerResposta(
        idResposta,
        db,
        session
      );
      if (!leituraResposta.success) {
        return {
          status: 404,
          body: {
            error: 'DATA_NOT_FOUND',
          },
        };
      }

      const resposta = leituraResposta.data;

      const leituraAtividade = await RepositorioAtividade.lerAtividade(
        resposta.idAtividade,
        db,
        session
      );
      if (!leituraAtividade.success) {
        throw leituraAtividade.error;
      }

      const atividade = leituraAtividade.data;
      if (atividade.tipoAtividade !== resposta.tipo) {
        throw Error('');
      }

      if (resposta.tipo === TipoAtividade.Alternativa) {
        //Intera????o impossibilitada
        return {
          status: 403,
          body: {
            error: 'NOT_AUTHORIZED',
          },
        };
      } else if (resposta.tipo === TipoAtividade.Dissertativa) {
        const castAtividade = atividade as Atividade & {
          tipoAtividade: TipoAtividade.Dissertativa;
        };
        if (!resposta.corrigida) {
          //Se a resposta ainda n??o tiver sido corrigida a intera????o apenas para corre????o da atividade
          //permiss??es: administrador, universit??rio, projeto da atividade e professor da atividade

          let permissao: boolean = false;

          const { idProjeto, idCurso, idMateria } = resposta;
          if (userProfile.regra === RegraPerfil.Geral) {
            if (userProfile.associacoes.professor.professor) {
              const idMateriasProfessor =
                userProfile.associacoes.professor.materiasProfessor.map(
                  (materia) => materia.id
                );
              if (
                idMateria !== null &&
                idMateriasProfessor.includes(idMateria)
              ) {
                permissao = true;
              }
            }

            if (userProfile.universitario.universitario) {
              permissao = true;
            }
          } else if (userProfile.regra === RegraPerfil.Administrador) {
            permissao = true;
          } else {
            const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
              userProfile.email,
              db,
              session
            );
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

          if (!CorrecaoQuestoesDissertativasValidator(body)) {
            return {
              status: 400,
              body: {
                error: JSON.stringify(
                  CorrecaoQuestoesDissertativasValidator.errors
                ),
              },
            };
          }

          const informacoes = body as InformacoesCorrecaoQuestoesDissertativas;

          let nota = 0.0;
          let totalPesos = 0.0;
          for (let i = 0; i < castAtividade.itens.length; i++) {
            const item = castAtividade.itens[i];
            const { idQuestao, peso } = item;
            const questaoCorrigida = informacoes.find(
              (info) => info.idQuestao === idQuestao
            );

            if (questaoCorrigida === undefined) {
              return {
                status: 400,
                body: {
                  error: idQuestao + ' sem correspond??ncia na corre????o',
                },
              };
            }

            const notaQuestao = questaoCorrigida.nota;
            nota = nota + peso * notaQuestao;
            totalPesos = totalPesos + peso;
          }

          const result =
            await RepositorioResposta.corrigirAtividadeDissertativa(
              idResposta,
              userProfile.id,
              nota / totalPesos,
              informacoes.map((info) => ({
                ...info,
                idProjeto: idProjeto,
                idCurso: idCurso,
                idMateria: idMateria,
              })),
              db,
              session
            );
          if (!result.success) {
            throw result.error;
          }

          if (
            userProfile.regra === RegraPerfil.Geral &&
            userProfile.universitario.universitario
          ) {
            const atrelarAtividadeUniversitario =
              await RepositorioUniveristario.atrelarColaboracao(
                userProfile.email,
                idResposta,
                castAtividade.id,
                castAtividade.tempoColaboracao,
                db,
                session,
                true
              );
            if (!atrelarAtividadeUniversitario.success) {
              throw atrelarAtividadeUniversitario.error;
            }
          }

          return {
            status: 200,
            body: null,
          };
        } else {
          //Se j?? tiver sido corrigida ou o aluno est?? requisitando uma revis??o
          //ou um projeto est?? atendendo a uma requisi????o de revis??o
          if (resposta.revisao === EstadoRevisao.Nenhum) {
            const { idAluno } = resposta;
            if (userProfile.id !== idAluno) {
              return {
                status: 403,
                body: {
                  error: 'NOT_AUTHORIZED',
                },
              };
            }

            const result =
              await RepositorioResposta.requisitarRevisaoAtividadeDissertativa(
                idResposta,
                db,
                session
              );
            if (!result.success) {
              throw result.error;
            }

            return {
              status: 200,
              body: null,
            };
          } else if (resposta.revisao === EstadoRevisao.Requisitada) {
            let permissao: boolean = false;

            const { idProjeto, idCurso, idMateria } = resposta;
            if (userProfile.regra === RegraPerfil.Geral) {
              if (userProfile.associacoes.professor.professor) {
                const idMateriasProfessor =
                  userProfile.associacoes.professor.materiasProfessor.map(
                    (materia) => materia.id
                  );
                if (
                  idMateria !== null &&
                  idMateriasProfessor.includes(idMateria)
                ) {
                  permissao = true;
                }
              }
            } else if (userProfile.regra === RegraPerfil.Administrador) {
              permissao = true;
            } else {
              const leituraProjeto =
                await RepositorioProjeto.readProjetoPorEmail(
                  userProfile.email,
                  db,
                  session
                );
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

            if (!CorrecaoQuestoesDissertativasValidator(body)) {
              return {
                status: 400,
                body: {
                  error: JSON.stringify(
                    CorrecaoQuestoesDissertativasValidator.errors
                  ),
                },
              };
            }

            const informacoes =
              body as InformacoesCorrecaoQuestoesDissertativas;

            let nota = 0.0;
            let totalPesos = 0.0;
            for (let i = 0; i < castAtividade.itens.length; i++) {
              const item = castAtividade.itens[i];
              const { idQuestao, peso } = item;
              const questaoCorrigida = informacoes.find(
                (info) => info.idQuestao === idQuestao
              );

              if (questaoCorrigida === undefined) {
                return {
                  status: 400,
                  body: {
                    error: idQuestao + ' sem correspond??ncia na corre????o',
                  },
                };
              }

              const notaQuestao = questaoCorrigida.nota;
              nota = nota + peso * notaQuestao;
              totalPesos = totalPesos + peso;
            }

            const result =
              await RepositorioResposta.finalizarRevisaoAtividadeDissertativa(
                idResposta,
                nota / totalPesos,
                informacoes.map((info) => ({
                  ...info,
                  idProjeto: idProjeto,
                  idCurso: idCurso,
                  idMateria: idMateria,
                })),
                db,
                session
              );
            if (!result.success) {
              throw result.error;
            }

            return {
              status: 200,
              body: null,
            };
          } else {
            return {
              status: 406,
              body: {
                error: 'REVISAO_JA_APROVADA',
              },
            };
          }
        }
      } else if (resposta.tipo === TipoAtividade.BancoDeQuestoes) {
        const castAtividade = atividade as Atividade & {
          tipoAtividade: TipoAtividade.BancoDeQuestoes;
        };
        //Intera????o apenas para aprovar quest??es para um banco de quest??es
        //permiss??es: projeto e professor
        let permissao: boolean = false;

        const { idProjeto, idCurso, idMateria } = resposta;
        if (userProfile.regra === RegraPerfil.Geral) {
          if (userProfile.associacoes.professor.professor) {
            const idMateriasProfessor =
              userProfile.associacoes.professor.materiasProfessor.map(
                (materia) => materia.id
              );
            if (idMateria !== null && idMateriasProfessor.includes(idMateria)) {
              permissao = true;
            }
          }
        } else if (userProfile.regra === RegraPerfil.Projeto) {
          const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
            userProfile.email,
            db,
            session
          );
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

        if (!InformacoesAvaliacaoBancoDeQuestaoValidator(body)) {
          return {
            status: 400,
            body: {
              error: JSON.stringify(
                InformacoesAvaliacaoBancoDeQuestaoValidator.errors
              ),
            },
          };
        }

        const informacoes = body as AvaliacaoRespostaBancoDeQuestoes;
        const result = await RepositorioResposta.avaliarRespostasBanco(
          idResposta,
          userProfile.id,
          informacoes,
          db,
          session
        );
        if (!result.success) {
          throw result.error;
        }

        const aprovacaoQuestoesBancoDeQuestoes =
          await RepositorioUniveristario.aprovarAtividades(
            [idResposta],
            db,
            session
          );
        if (!aprovacaoQuestoesBancoDeQuestoes.success)
          throw aprovacaoQuestoesBancoDeQuestoes.error;

        return {
          status: 200,
          body: null,
        };
      } else {
        throw Error('Reposta com tipo de atividade inv??lido');
      }
    };

    return await withDatabaseTransaction(service);
  }
);
