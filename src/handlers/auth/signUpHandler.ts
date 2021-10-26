import { ClientSession } from 'mongoose';
import { createAuthAccount } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/navigation';
import { LoginValidator } from '../../schemas/login';

export const signUpHandler = new Handler(
  async (
    context: Context,
    session: ClientSession
  ): Promise<NavigationResult<{ authToken: string }>> => {
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

    const registerResult = await createAuthAccount(email, password);
    if (!registerResult.success) {
      return {
        databaseSuccess: false,
        result: {
          status: 406,
          body: {
            error: 'CANT_REGISTER_THAT_PROFILE',
          },
        },
      };
    }
    return {
      databaseSuccess: true,
      result: {
        status: 200,
        body: {
          authToken: registerResult.data.token,
        },
      },
    };
  }
);
