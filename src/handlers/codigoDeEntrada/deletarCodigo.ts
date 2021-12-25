import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { CodigoDeEntrada, Perfil, RegraPerfil } from '../../models';
import { ValidatorCriacaoCodigoDeEntrada } from '../../schemas/codigoEntrada';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const deletarCodigoHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const id = context.params['id'] as string;

    const userProfile = context.getVariable<Perfil>('profile');

    if (userProfile.regra == RegraPerfil.Geral) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      if (userProfile.regra !== RegraPerfil.Administrador) {
        const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
          userProfile.email,
          db,
          session
        );
        if (!readProjeto.success) {
          return {
            status: 403,
            body: {
              error: 'NOT_AUTHORIZED',
            },
          };
        }
      }

      const result = await RepositorioCodigoDeEntrada.removerCodigoDeEntrada(
        id,
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
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
