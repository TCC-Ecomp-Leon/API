import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { CodigoDeEntrada, Perfil, RegraPerfil } from '../../models';
import RepositorioCodigoDeEntrada from '../../services/repositories/RepositorioCodigoDeEntrada';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const getCodigosHandler = new Handler(
  async (
    context: Context
  ): Promise<NavigationResult<{ codigos: CodigoDeEntrada[] }>> => {
    const userProfile = context.getVariable<Perfil>('profile');

    if (userProfile.regra === RegraPerfil.Geral) {
      return {
        status: 403,
        body: {
          error: 'NOT_AUTHORIZED',
        },
      };
    }

    const service: DatabaseService<
      NavigationResult<{ codigos: CodigoDeEntrada[] }>
    > = async (db, session) => {
      let idProjeto: string | undefined = undefined;

      if (userProfile.regra === RegraPerfil.Projeto) {
        const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
          userProfile.email,
          db,
          session
        );
        if (!readProjeto.success) {
          throw readProjeto.error;
        }

        idProjeto = readProjeto.data.id;
      }

      const readCodigos = await RepositorioCodigoDeEntrada.readCodigosDeEntrada(
        idProjeto,
        undefined,
        undefined,
        undefined,
        db,
        session
      );

      if (!readCodigos.success) {
        throw readCodigos.error;
      }

      return {
        status: 200,
        body: {
          codigos: readCodigos.data,
        },
      };
    };

    return await withDatabaseTransaction(service);
  }
);
