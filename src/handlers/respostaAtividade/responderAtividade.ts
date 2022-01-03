import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil, TipoAtividade } from '../../models';
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

export const responderAtividadeHandler = new Handler(
  async (context): Promise<NavigationResult<null>> => {
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

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
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
          idAtividade,
          userProfile.id,
          informacoesResposta.respostas,
          db,
          session
        );
      } else if (informacoesResposta.tipo === TipoAtividade.Dissertativa) {
        result = await RepositorioResposta.responderAtividadeDissertativa(
          idAtividade,
          userProfile.id,
          informacoesResposta.respostas,
          db,
          session
        );
      } else if (informacoesResposta.tipo === TipoAtividade.BancoDeQuestoes) {
        result = await RepositorioResposta.responderAtividadeBancoDeQuestoes(
          idAtividade,
          userProfile.id,
          informacoesResposta.respostas.map((info) => ({
            ...info,
            idAtividade: idAtividade,
          })),
          db,
          session
        );
      } else {
        throw Error('Resposta de atividade com tipo inválido');
      }

      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
