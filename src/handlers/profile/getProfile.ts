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
import { getProfile, NavigationResult } from '../../structure/navigation';

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

      const profileResult = await getProfile(
        profileId,
        authInfo.data.email,
        authInfo.data.emailVerified,
        session,
        db
      );

      if (!profileResult.success || profileResult.data === null) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }

      return {
        status: 200,
        body: profileResult.data,
      };
    };

    return await withDatabaseTransaction(service);
  }
);
