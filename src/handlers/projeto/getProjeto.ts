import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, Projeto, RegraPerfil } from '../../models';
import { AtualizarProjetoValidator } from '../../schemas/projeto';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const getProjetoHandler = new Handler(
  async (context): Promise<NavigationResult<{ projeto: Projeto }>> => {
    const idProjeto = context.params['id'] as string;

    const userProfile = getCurrentProfile<Perfil>(context);

    const service: DatabaseService<NavigationResult<{ projeto: Projeto }>> =
      async (db, session) => {
        const leituraProjeto = await RepositorioProjeto.readProjeto(
          idProjeto,
          db,
          session
        );
        if (!leituraProjeto.success) {
          return {
            status: 404,
            body: {
              error: 'PROJETO_NAO_ENCONTRADO',
            },
          };
        }

        return {
          status: 200,
          body: {
            projeto: leituraProjeto.data,
          },
        };
      };

    return await withDatabaseTransaction(service);
  }
);
