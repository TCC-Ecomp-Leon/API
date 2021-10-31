import { ClientSession, Db } from 'mongodb';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';
import { checkLoginToken } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import { DatabaseResult } from '../../structure/databaseResult';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';

export const authHandler = <T>(
  getProfile: (
    userId: string,
    email: string,
    session: ClientSession,
    db: Db
  ) => Promise<DatabaseResult<T | null>>,
  roleFunction?: (profile: T) => boolean
) =>
  new Handler(async (context: Context): Promise<NavigationResult<null>> => {
    const authToken = context.getAuthToken();
    if (authToken === null)
      return {
        status: 401,
        body: {
          error: 'REQUEST_WITHOUT_TOKEN',
        },
      };
    const authResult = await checkLoginToken(authToken);
    if (!authResult.success) {
      return {
        status: 401,
        body: {
          error: 'INVALID_TOKEN',
        },
      };
    }

    const service: DatabaseService<NavigationResult<null>> = async (
      db,
      session
    ) => {
      const profileResult = await getProfile(
        authResult.data.userId,
        authResult.data.email,
        session,
        db
      );
      if (!profileResult.success) {
        throw profileResult.error;
      }
      if (profileResult.data === null) {
        return {
          status: 404,
          body: {
            error: 'PROFILE_NOT_FOUND',
          },
        };
      }
      if (roleFunction !== undefined) {
        if (!roleFunction(profileResult.data)) {
          return {
            status: 403,
            body: {
              error: 'NOT_AUTHORIZED',
            },
          };
        }
      }
      context.setVariable<T>('profile', profileResult.data);

      return null;
    };

    return await withDatabaseTransaction(service);
  });
