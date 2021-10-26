import { ClientSession } from 'mongoose';
import { signInWithEmailAndPassword } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';
import { LoginValidator } from '../../schemas/login';
import { DatabaseResult } from '../../structure/databaseResult';

export const signInHandler = <T>(
  getProfile: (
    token: string,
    session: ClientSession
  ) => Promise<DatabaseResult<T | null>>
) => {
  return new Handler(
    async (
      context: Context,
      session: ClientSession
    ): Promise<NavigationResult<{ authToken: string; profile: T }>> => {
      if (!LoginValidator(context.body as object)) {
        return {
          databaseSuccess: false,
          result: {
            status: 400,
            body: {
              error: JSON.stringify(LoginValidator.errors),
            },
          },
        };
      }
      const email = context.body['email'] as string;
      const password = context.body['password'] as string;

      const authResult = await signInWithEmailAndPassword(email, password);
      if (!authResult.success) {
        return {
          databaseSuccess: false,
          result: {
            status: 401,
            body: { error: 'INVALID_EMAIL_OR_PASSWORD' },
          },
        };
      }

      const profileResult = await getProfile(authResult.data.token, session);
      if (!profileResult.success) {
        throw profileResult.error;
      }
      if (profileResult.data === null) {
        return {
          databaseSuccess: false,
          result: {
            status: 404,
            body: { error: 'PROFILE_NOT_FOUND' },
          },
        };
      }

      return {
        databaseSuccess: true,
        result: {
          status: 200,
          body: {
            authToken: authResult.data.token,
            profile: profileResult.data,
          },
        },
      };
    }
  );
};
