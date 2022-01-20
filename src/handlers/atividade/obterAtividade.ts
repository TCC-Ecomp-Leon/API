import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Atividade, Perfil } from '../../models';
import RepositorioAtividade from '../../services/repositories/RepositorioAtividade';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const obterAtividadeHandler = new Handler(
  async (context): Promise<NavigationResult<{ atividade: Atividade }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const idAtividade = context.params['idAtividade'] as string;

    const service: DatabaseService<NavigationResult<{ atividade: Atividade }>> =
      async (db, session) => {
        const result = await RepositorioAtividade.lerAtividade(
          idAtividade,
          db,
          session
        );

        if (!result.success) {
          return {
            status: 404,
            body: {
              error: 'DATA_NOT_FOUND',
            },
          };
        }

        return {
          status: 200,
          body: {
            atividade: result.data,
          },
        };
      };

    return await withDatabaseTransaction(service);
  }
);
