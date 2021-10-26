import { Express, Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { checkLoginToken } from '../services/authentification/firebaseAuth';
import Context from './context';
import { DatabaseResult } from './databaseResult';
import Handler from './handler';
import { OperationResult } from './response';

export type NavigationResult<T> = {
  databaseSuccess: boolean;
  result: OperationResult<T>;
};

export default class Navigation {
  handlers: Array<Handler<any>>;

  constructor(handlers: Array<Handler<any>>) {
    this.handlers = handlers;
  }

  async navigate(context: Context): Promise<
    | {
        success: true;
        status: number;
        body: any;
      }
    | {
        success: false;
        error: Error;
      }
  > {
    for (let i = 0; i < this.handlers.length; i++) {
      let session: ClientSession | undefined = undefined;
      try {
        const handler: Handler<any> = this.handlers[i];
        session = await handler.getSession();
        session.startTransaction();
        const result = await handler.run(context, session);

        if (result.databaseSuccess) {
          await session.commitTransaction();
        } else {
          await session.abortTransaction();
        }
        session.endSession();

        if (result.result !== null) {
          return { ...result.result, success: true };
        }
      } catch (e) {
        if (session !== undefined) {
          await session.abortTransaction();
          session.endSession();
        }
        return {
          success: false,
          error: e as Error,
        };
      }
    }

    return { error: Error('Handlers without response'), success: false };
  }
}

export const ProtectedNavigation = <T>(
  handlers: Array<Handler<any>>,
  getProfile: (
    userId: string,
    email: string,
    session: ClientSession
  ) => Promise<DatabaseResult<T | null>>,
  roleFunction?: (profile: T) => boolean
) => {
  return new Navigation([
    new Handler(
      async (
        context: Context,
        session: ClientSession
      ): Promise<NavigationResult<null>> => {
        const authToken = context.getAuthToken();
        if (authToken === null)
          return {
            databaseSuccess: false,
            result: {
              status: 401,
              body: {
                error: 'REQUEST_WITHOUT_TOKEN',
              },
            },
          };
        const authResult = await checkLoginToken(authToken);
        if (!authResult.success) {
          return {
            databaseSuccess: false,
            result: {
              status: 401,
              body: {
                error: 'INVALID_TOKEN',
              },
            },
          };
        }
        const profileResult = await getProfile(
          authResult.data.userId,
          authResult.data.email,
          session
        );
        if (!profileResult.success) {
          throw profileResult.error;
        }
        if (profileResult.data === null) {
          return {
            databaseSuccess: false,
            result: {
              status: 404,
              body: {
                error: 'PROFILE_NOT_FOUND',
              },
            },
          };
        }
        if (roleFunction !== undefined) {
          if (!roleFunction(profileResult.data)) {
            return {
              databaseSuccess: false,
              result: {
                status: 403,
                body: {
                  error: 'NOT_AUTHORIZED',
                },
              },
            };
          }
        }
        context.setVariable<T>('profile', profileResult.data);

        return {
          databaseSuccess: true,
          result: null,
        };
      }
    ),
    ...handlers,
  ]);
};
