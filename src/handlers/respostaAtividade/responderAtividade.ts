import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Atividade, Perfil, RegraPerfil, TipoAtividade } from '../../models';
import { InformacoesAtividadeValidator } from '../../schemas/atividade';
import {
  InformacoesResposta,
  RespostaAtividadeValidator,
} from '../../schemas/respostaAtividade';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import RepositorioResposta from '../../services/repositories/RepositorioResposta';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';
import { v4 as uuid } from 'uuid';
import RepositorioUniversitario from '../../services/repositories/RepositorioUniversitario';

export const responderAtividadeHandler = new Handler(
  async (context): Promise<NavigationResult<{ idResposta: string }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    const idAtividade = context.params['idAtividade'] as string;

    const body = context.body as any;

    if (
      userProfile.regra !== RegraPerfil.Geral ||
      (!userProfile.associacoes.aluno.alunoParceiro &&
        !userProfile.universitario.universitario)
    ) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    if (!RespostaAtividadeValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(InformacoesAtividadeValidator.errors),
        },
      };
    }

    const informacoesResposta = body as InformacoesResposta;

    const service: DatabaseService<NavigationResult<{ idResposta: string }>> =
      async (db, session) => {
        const leituraAtividade = await RepositorioAtividade.lerAtividade(
          idAtividade,
          db,
          session
        );
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
          if (
            cursosAluno.find((curso) => curso.id === atividade.idCurso) ==
            undefined
          ) {
            return {
              status: 403,
              body: {
                error: 'NOT_AUTHORIZED',
              },
            };
          }
        }

        let result: DatabaseResult<string>;

        if (informacoesResposta.tipo === TipoAtividade.Alternativa) {
          result = await RepositorioResposta.responderAtividadeAlternativa(
            atividade.idProjeto,
            atividade.idCurso,
            atividade.idMateria,
            idAtividade,
            userProfile.id,
            informacoesResposta.respostas,
            db,
            session
          );
        } else if (informacoesResposta.tipo === TipoAtividade.Dissertativa) {
          result = await RepositorioResposta.responderAtividadeDissertativa(
            atividade.idProjeto,
            atividade.idCurso,
            atividade.idMateria,
            idAtividade,
            userProfile.id,
            informacoesResposta.respostas,
            db,
            session
          );
        } else if (informacoesResposta.tipo === TipoAtividade.BancoDeQuestoes) {
          if (
            userProfile.regra === RegraPerfil.Geral &&
            userProfile.universitario.universitario === false
          ) {
            return {
              status: 403,
              body: {
                error: 'NOT_AUTHORIZED',
              },
            };
          }
          result = await RepositorioResposta.responderAtividadeBancoDeQuestoes(
            atividade.idProjeto,
            atividade.idCurso,
            atividade.idMateria,
            idAtividade,
            userProfile.id,
            informacoesResposta.respostas.map((info) => ({
              ...info,
              idAtividade: idAtividade,
              idQuestao: uuid(),
            })),
            db,
            session
          );

          const castAtividade = atividade as Atividade & {
            tipoAtividade: TipoAtividade.BancoDeQuestoes;
          };
          if (!result.success) throw result.error;
          const result2 = await RepositorioUniversitario.atrelarColaboracao(
            userProfile.email,
            result.data,
            idAtividade,
            castAtividade.tempoColaboracao,
            db,
            session
          );
          if (!result2.success) throw result2.error;
        } else {
          throw Error('Resposta de atividade com tipo inv??lido');
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

    return await withDatabaseTransaction(service);
  }
);
