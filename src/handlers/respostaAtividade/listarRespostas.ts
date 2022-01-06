import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil, RespostaAtividade } from '../../models';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import RepositorioResposta from '../../services/repositories/RepositorioResposta';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const listarRespostasHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ respostas: RespostaAtividade[] }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const queryParamProjeto = context.query['projeto'];
    const queryParamAtividade = context.query['atividade'];

    let idProjeto: string | undefined = undefined;
    let idAtividade: string | undefined = undefined;

    if (queryParamProjeto !== undefined) {
      idProjeto = queryParamProjeto as string;
    }
    if (queryParamAtividade !== undefined) {
      idAtividade = queryParamAtividade as string;
    }

    if (
      userProfile.regra === RegraPerfil.Geral &&
      !userProfile.universitario.universitario
    ) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<
      NavigationResult<{ respostas: RespostaAtividade[] }>
    > = async (db, session) => {
      let result: DatabaseResult<RespostaAtividade[]>;
      if (idAtividade !== undefined) {
        result = await RepositorioResposta.lerRespostasEspecificas(
          'idAtividade',
          idAtividade,
          db,
          session
        );
      } else if (idProjeto !== undefined) {
        result = await RepositorioResposta.lerRespostasEspecificas(
          'idProjeto',
          idAtividade,
          db,
          session
        );
      } else {
        result = await RepositorioResposta.lerRespostas(db, session);
      }

      if (!result.success) throw result.error;

      return {
        status: 200,
        body: {
          respostas: result.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
