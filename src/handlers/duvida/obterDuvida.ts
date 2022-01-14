import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Duvida, Perfil, RegraPerfil } from '../../models';
import RepositorioDuvida from '../../services/repositories/RepositorioDuvida';
import Handler from '../../structure/handler';
import {
  getCurrentProfile,
  NavigationResult,
} from '../../structure/navigation';

export const obterDuvidaHandler = new Handler(
  async (context): Promise<NavigationResult<{ duvida: Duvida }>> => {
    const userProfile = getCurrentProfile<Perfil>(context);
    const idDuvida = context.params['id'] as string;

    const service: DatabaseService<NavigationResult<{ duvida: Duvida }>> =
      async (db, session) => {
        const leituraDuvida = await RepositorioDuvida.readDuvida(
          idDuvida,
          db,
          session
        );
        if (!leituraDuvida.success) {
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
            duvida: leituraDuvida.data,
          },
        };
      };
    return await withDatabaseTransaction(service);
  }
);
