import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, Projeto, RegraPerfil } from '../../models';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const getProjetosHandler = new Handler(
  async (context): Promise<NavigationResult<{ projetos: Projeto[] }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);

    const service: DatabaseService<NavigationResult<{ projetos: Projeto[] }>> =
      async (db, session) => {
        const readProjetos = await RepositorioProjeto.readProjetos(
          undefined,
          db,
          session
        );
        if (!readProjetos.success) {
          throw readProjetos.error;
        }

        return {
          status: 200,
          body: {
            projetos: readProjetos.data,
          },
        };
      };

    return await withDatabaseTransaction(service);
  }
);
