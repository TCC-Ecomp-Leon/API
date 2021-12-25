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

export const criarCodigoHandler = new Handler(
  async (
    context: Context
  ): Promise<NavigationResult<{ codigo: CodigoDeEntrada }>> => {
    const body = context.body as object;
    if (!ValidatorCriacaoCodigoDeEntrada(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(ValidatorCriacaoCodigoDeEntrada.errors),
        },
      };
    }

    const userProfile = context.getVariable<Perfil>('profile');

    if (userProfile.regra !== RegraPerfil.Projeto) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<
      NavigationResult<{ codigo: CodigoDeEntrada }>
    > = async (db, session) => {
      const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
        userProfile.email,
        db,
        session
      );
      if (!readProjeto.success) {
        throw readProjeto.error;
      }

      const result = await RepositorioCodigoDeEntrada.addCodigoDeEntrada(
        readProjeto.data.id,
        body,
        db,
        session
      );

      if (!result.success) {
        throw result.error;
      }

      return {
        status: 200,
        body: {
          codigo: result.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);