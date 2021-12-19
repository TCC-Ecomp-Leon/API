import {
  createAuthAccount,
  signInWithEmailAndPassword,
} from '../../services/authentification/firebaseAuth';
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
import { ValidateFunction } from 'ajv';

export const signUpHandler = <T>(
  validators: ValidateFunction[],
  customValidators: {
    activationFunction: (body: any) => boolean;
    validator: ValidateFunction;
  }[],
  mountProfile: (body: any) => T,
  addProfile: (
    userId: string,
    profile: T,
    context: Context,
    db: Db,
    session: ClientSession
  ) => Promise<DatabaseResult<null>>
) => {
  return new Handler(
    async (
      context: Context
    ): Promise<NavigationResult<{ authToken: string }>> => {
      if (!LoginValidator(context.body)) {
        return {
          status: 400,
          body: {
            error: JSON.stringify(LoginValidator.errors),
          },
        };
      }
      const email = context.body['email'] as string;
      const password = context.body['password'] as string;

      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        if (!validator(context.body)) {
          return {
            status: 400,
            body: {
              error: JSON.stringify(validator.errors),
            },
          };
        }
      }

      for (let i = 0; i < customValidators.length; i++) {
        const activation = customValidators[i].activationFunction(context.body);

        if (activation) {
          const validator = customValidators[i].validator;
          if (!validator(context.body)) {
            return {
              status: 400,
              body: {
                error: JSON.stringify(validator.errors),
              },
            };
          }
        }
      }

      const profile = mountProfile(context.body);

      const service: DatabaseService<NavigationResult<{ authToken: string }>> =
        async (db, session) => {
          const registerResult = await createAuthAccount(email, password);
          if (!registerResult.success) {
            return {
              status: 406,
              body: {
                error: 'CANT_REGISTER_THAT_PROFILE',
              },
            };
          }
          const addProfileResult = await addProfile(
            registerResult.data.userId,
            profile,
            context,
            db,
            session
          );
          if (!addProfileResult.success) {
            throw addProfileResult.error;
          }

          return {
            status: 200,
            body: {
              authToken: registerResult.data.token,
            },
          };
        };

      return await withDatabaseTransaction(service);
    }
  );
};
