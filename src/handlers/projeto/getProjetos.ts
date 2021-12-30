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
    let pesquisaPorEmail = context.query['email'];

    const userProfile = getCurrentProfile<Perfil>(context);

    const service: DatabaseService<NavigationResult<{ projetos: Projeto[] }>> =
      async (db, session) => {
        if (pesquisaPorEmail !== undefined) {
          pesquisaPorEmail = pesquisaPorEmail as string;

          const leituraProjeto = await RepositorioProjeto.readProjetoPorEmail(
            pesquisaPorEmail,
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
              projetos: [leituraProjeto.data],
            },
          };
        }

        const readProjetos = await RepositorioProjeto.readProjetos(
          true,
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
