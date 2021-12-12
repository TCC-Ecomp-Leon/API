import { signInWithEmailAndPassword } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';
import { LoginValidator } from '../../schemas/login';
import { DatabaseResult } from '../../structure/databaseResult';
import { ClientSession, Db } from 'mongodb';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';

export const signInHandler = <T>(
  getProfile: (
    userId: string,
    email: string,
    emailValidado: boolean,
    db: Db,
    session: ClientSession
  ) => Promise<DatabaseResult<T | null>>,
  necessarioValirEmail: boolean = false
) => {
  return new Handler(
    async (
      context: Context
    ): Promise<NavigationResult<{ authToken: string; profile: T }>> => {
      if (!LoginValidator(context.body as object)) {
        return {
          status: 400,
          body: {
            error: JSON.stringify(LoginValidator.errors),
          },
        };
      }
      const email = context.body['email'] as string;
      const password = context.body['password'] as string;

      const authResult = await signInWithEmailAndPassword(
        email,
        password,
        necessarioValirEmail
      );
      if (!authResult.success) {
        return {
          status: 401,
          body: { error: 'INVALID_EMAIL_OR_PASSWORD' },
        };
      }

      const service: DatabaseService<
        NavigationResult<{ authToken: string; profile: T }>
      > = async (db, session) => {
        const email = context.body['email'] as string;
        const profileResult = await getProfile(
          authResult.data.userId,
          email,
          authResult.data.emailVerified,
          db,
          session
        );
        if (!profileResult.success) {
          throw profileResult.error;
        }
        if (profileResult.data === null) {
          return {
            status: 404,
            body: { error: 'PROFILE_NOT_FOUND' },
          };
        }

        return {
          status: 200,
          body: {
            authToken: authResult.data.token,
            profile: profileResult.data,
          },
        };
      };

      return await withDatabaseTransaction(service);
    }
  );
};
