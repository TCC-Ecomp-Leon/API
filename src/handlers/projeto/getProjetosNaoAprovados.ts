import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Projeto } from '../../models';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const getProjetosNaoAprovadosHandler = new Handler(
  async (context): Promise<NavigationResult<{ projetos: Projeto[] }>> => {
    const service: DatabaseService<NavigationResult<{ projetos: Projeto[] }>> =
      async (db, session) => {
        const readProjetos = await RepositorioProjeto.readProjetos(
          false,
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
