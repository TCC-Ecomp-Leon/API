import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { Perfil } from '../../models';
import { readAuthProfile } from '../../services/authentification/firebaseAuth';
import dummyService from '../../services/data/dummyService';
import RepositorioPerfil from '../../services/repositories/RepositorioPerfil';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const getProfileHandler = new Handler(
  async (context: Context): Promise<NavigationResult<Perfil>> => {
    const service: DatabaseService<NavigationResult<Perfil>> = async (
      db,
      session
    ) => {
      const profileId = context.params['id'] as string;

      const authInfo = await readAuthProfile(profileId);
      if (!authInfo.success) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }

      const readPerfil = await RepositorioPerfil.readPerfil(
        profileId,
        authInfo.data.email,
        authInfo.data.emailVerified,
        db,
        session
      );

      if (!readPerfil.success) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }

      return {
        status: 200,
        body: readPerfil.data,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
