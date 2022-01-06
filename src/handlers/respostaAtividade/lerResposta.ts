import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil, RespostaAtividade } from '../../models';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import RepositorioResposta from '../../services/repositories/RepositorioResposta';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const lerRespostaHandler = new Handler(
  async (
    context
  ): Promise<NavigationResult<{ resposta: RespostaAtividade }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    const idResposta = context.params['idResposta'] as string;

    const service: DatabaseService<
      NavigationResult<{ resposta: RespostaAtividade }>
    > = async (db, session) => {
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

      return {
        status: 200,
        body: {
          resposta: resposta,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
