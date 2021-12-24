import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil } from '../../models';
import {
  readAuthProfile,
  updateEmailAndPassword,
} from '../../services/authentification/firebaseAuth';
import dummyService from '../../services/data/dummyService';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';
import { LoginValidator } from '../../schemas/login';

export const changeEmailAndPasswordHandler = new Handler(
  async (context: Context): Promise<NavigationResult<null>> => {
    const userProfile = context.getVariable<Perfil>('profile');
    const body = context.body;

    if (!LoginValidator(body)) {
      return {
        status: 400,
        body: {
          error: JSON.stringify(LoginValidator.errors),
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const alterarPerfil = await RepositorioPerfil.atualizarPerfil(
        userProfile.id,
        {
          email: body.email,
        },
        db,
        session
      );

      if (!alterarPerfil.success) {
        throw alterarPerfil.error;
      }

      const alterarAuth = await updateEmailAndPassword(
        context.getAuthToken()!,
        body.email,
        body.password
      );

      if (!alterarAuth.success) {
        throw alterarAuth.error;
      }

      return {
        status: 200,
        body: null,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
