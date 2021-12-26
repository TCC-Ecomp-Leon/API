import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil, RegraPerfil } from '../../models';
import { deleteAccount } from '../../services/authentification/firebaseAuth';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import RepositorioProjeto from '../../services/repositories/RepositorioProjeto';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const deleteProfileHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const userProfile = context.getVariable<Perfil>('profile');

    const authToken = context.getAuthToken();
    if (authToken === null) {
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
      const dbResult = await RepositorioPerfil.deletarPerfil(
        userProfile.id,
        db,
        session
      );

      if (!dbResult.success) {
        throw dbResult.error;
      }

      if (userProfile.regra === RegraPerfil.Projeto) {
        const remocaoProjeto = await RepositorioProjeto.removerProjetoPorEmail(
          userProfile.email,
          db,
          session
        );

        if (!remocaoProjeto.success) {
          throw remocaoProjeto.error;
        }
      }

      const authResult = await deleteAccount(authToken);

      if (!authResult.success) {
        throw authResult.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
